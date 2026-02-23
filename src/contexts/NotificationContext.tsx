import React, { createContext, useContext, useEffect, useState } from 'react';
import { socket } from '../services/socket';
import { useAuth } from '../contexts/AuthContext';
import { socialService } from '../services';
import { toast } from 'sonner';

interface NotificationContextType {
  unreadMessages: number;
  unreadBySender: Record<string, number>;
  pendingRequests: number;
  refreshNotifications: () => Promise<void>;
  clearUnread: (senderId: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [unreadBySender, setUnreadBySender] = useState<Record<string, number>>({});
  const [pendingRequests, setPendingRequests] = useState(0);

  const unreadMessages = Object.values(unreadBySender).reduce((acc, curr) => acc + curr, 0);

  const fetchInitialData = async () => {
    if (!isAuthenticated) return;
    try {
      const pending = await socialService.getPending();
      setPendingRequests(pending.length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const clearUnread = (senderId: string) => {
    setUnreadBySender(prev => {
      const next = { ...prev };
      delete next[senderId];
      return next;
    });
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      if (!socket.connected) socket.connect();
      socket.emit('register', { userId: user.id });

      fetchInitialData();

      socket.on('newFriendRequest', () => {
        setPendingRequests(prev => prev + 1);
      });

      socket.on('newMessage', (msg: any) => {
        // Show visual notification
        toast.message(`New message from ${msg.senderName || 'User'}`, {
           description: msg.content,
        });

        // Increment unread count for this sender
        setUnreadBySender(prev => ({
          ...prev,
          [msg.senderId]: (prev[msg.senderId] || 0) + 1
        }));
      });

      return () => {
        socket.off('newFriendRequest');
        socket.off('newMessage');
      };
    } else {
      socket.disconnect();
    }
  }, [isAuthenticated, user]);

  return (
    <NotificationContext.Provider value={{ unreadMessages, unreadBySender, pendingRequests, refreshNotifications: fetchInitialData, clearUnread }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
