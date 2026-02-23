import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import { 
  Search, 
  UserPlus, 
  MessageCircle, 
  Users,
  Check,
  X,
  Send,
  Loader2,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import owlImg from "@/assets/owl-character.png";
import pantherImg from "@/assets/panther-character.png";
import snakeImg from "@/assets/snake-character.png";
// Use services
import { socialService, chatService, gameSocketService } from "../services";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

const animalAvatars = [owlImg, pantherImg, snakeImg];

const Social = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"friends" | "requests" | "chat">("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [offsetSearch, setOffsetSearch] = useState(0);

  // Chat
  const [activeChatFriend, setActiveChatFriend] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (user) {
        loadSocialData();
        
        const token = localStorage.getItem('token');
        if (token) {
            gameSocketService.connect(token);
            gameSocketService.registerUser(user.id);
        }

        gameSocketService.onNewMessage((msg) => {
            if (activeChatFriend && (msg.senderId === activeChatFriend.id || msg.receiverId === activeChatFriend.id)) {
                setMessages(prev => [...prev, msg]);
            } else {
                toast.info("New message received!");
            }
        });

        gameSocketService.onNewFriendRequest((data) => {
             toast.info(`New friend request from ${data.senderName}`);
             loadSocialData();
        });

        // Add listener for accepted requests
        gameSocketService.socket?.on('friendRequestAccepted', (data: any) => {
            toast.success(`${data.friendName} accepted your friend request!`);
            loadSocialData();
        });

        return () => {
             gameSocketService.disconnect();
        };
    }
  }, [user, activeChatFriend]);

  const loadSocialData = async () => {
      setIsLoading(true);
      try {
          const [friendsData, requestsData] = await Promise.all([
              socialService.getFriends(),
              socialService.getPending()
          ]);
          setFriends(friendsData);
          setRequests(requestsData);
      } catch (error) {
          console.error("Failed to load social data", error);
      } finally {
          setIsLoading(false);
      }
  };

  const handleSearch = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!searchQuery.trim()) return;
      try {
          const results = await socialService.searchUsers(searchQuery, 0);
          setSearchResults(results);
      } catch (error) {
          toast.error("Failed to search");
      }
  };

  const sendRequest = async (email: string) => {
      try {
          await socialService.sendRequest(email);
          toast.success(`Request sent to ${email}`);
          setSearchResults([]);
          setSearchQuery("");
      } catch (error: any) {
          toast.error(error.response?.data?.message || "Failed to send request");
      }
  };

  const handleRequest = async (id: string, status: 'accepted' | 'rejected') => {
      try {
          await socialService.handleRequest(id, status);
          toast.success(`Request ${status}`);
          loadSocialData();
      } catch (error) {
          toast.error("Failed to update request");
      }
  };

  const startChat = async (friend: any) => {
      setActiveChatFriend(friend);
      setActiveTab("chat");
      try {
          const history = await chatService.getHistory(friend.id);
          setMessages(history);
      } catch (error) {
          console.error("Failed chat load", error);
      }
  };

  const sendMessage = () => {
      if (!newMessage.trim() || !activeChatFriend || !user) return;
      const msg = {
          id: Date.now().toString(),
          senderId: user.id,
          receiverId: activeChatFriend.id,
          content: newMessage,
          createdAt: new Date().toISOString()
      };
      setMessages(prev => [...prev, msg]);
      gameSocketService.sendMessage(user.id, activeChatFriend.id, newMessage);
      setNewMessage("");
  };

  const tabs = [
    { id: "friends" as const, label: "Pack", icon: Users, count: friends.length },
    { id: "requests" as const, label: "Requests", icon: UserPlus, count: requests.length },
    { id: "chat" as const, label: "Chat", icon: MessageCircle, count: 0 },
  ];

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 pt-28 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-display text-4xl mb-4">
              The <span className="gradient-text">Pack</span> 🐾
            </h1>
            <p className="text-muted-foreground">
              Connect with jungle friends, chat, and challenge fellow explorers.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 relative"
          >
            <form onSubmit={handleSearch} className="relative z-30">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search explorers by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-glass w-full pl-12"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 btn-neon px-4 py-1 text-xs">
                  Search
              </button>
            </form>

            {searchResults.length > 0 && (
                <div className="mt-2 glass-card p-4 absolute w-full z-20 max-h-60 overflow-y-auto custom-scrollbar">
                    <div className="flex justify-between items-center mb-2 sticky top-0 bg-background/95 backdrop-blur p-2 rounded z-10 border-b border-border/50">
                        <span className="text-sm font-semibold text-primary">Found Explorers</span>
                        <button onClick={() => setSearchResults([])} className="hover:bg-muted/50 p-1 rounded"><X className="w-4 h-4" /></button>
                    </div>
                    {searchResults.map(result => (
                        <div key={result.id} className="flex items-center justify-between p-2 hover:bg-muted/20 rounded transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-border group-hover:ring-primary/50 transition-all bg-muted/20">
                                    <img 
                                        src={result.avatar === 'panther' ? pantherImg : result.avatar === 'snake' ? snakeImg : owlImg} 
                                        alt={result.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm">{result.name}</span>
                                    <span className="text-[10px] text-muted-foreground">{result.email}</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => sendRequest(result.email)}
                                className="bg-primary/10 text-primary p-2 rounded hover:bg-primary/20 transition-colors"
                                title="Add Friend"
                            >
                                <UserPlus className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {/* Add visual cue for end of results or load more if implemented in future */}
                </div>
            )}
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2 mb-6"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeTab === tab.id
                      ? "bg-primary-foreground/20"
                      : "bg-primary/20 text-primary"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            {isLoading ? (
                 <div className="flex justify-center py-8"><Loader2 className="animate-spin" /></div>
            ) : (
                <>
                    {activeTab === "friends" && (
                    <div className="space-y-3">
                        {friends.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No friends in your pack yet. Search to add some! 🐾
                            </div>
                        ) : (
                            friends.map((friend) => (
                            <div
                                key={friend.id}
                                className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-primary/20 bg-muted/20">
                                    <img 
                                        src={friend.avatar === 'panther' ? pantherImg : friend.avatar === 'snake' ? snakeImg : owlImg} 
                                        alt={friend.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold truncate">{friend.name}</span>
                                    <span className={`w-2 h-2 rounded-full bg-green-400`} />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Level {friend.gameProgress?.currentLevel || 1}
                                </p>
                                </div>
                                <button 
                                    onClick={() => startChat(friend)}
                                    className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                                >
                                <MessageCircle className="w-5 h-5" />
                                </button>
                            </div>
                            ))
                        )}
                    </div>
                    )}

                    {activeTab === "requests" && (
                    <div className="space-y-3">
                        {requests.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            No pending requests
                        </div>
                        ) : (
                        requests.map((request) => (
                            <div
                            key={request.id}
                            className="flex items-center gap-4 p-4 rounded-xl bg-muted/30"
                            >
                            <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-secondary/20 bg-muted/20">
                                <img 
                                    src={request.avatar === 'panther' ? pantherImg : request.avatar === 'snake' ? snakeImg : owlImg} 
                                    alt={request.senderName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="font-bold truncate block">{request.senderName}</span>
                                <span className="text-xs text-muted-foreground">{request.senderEmail}</span>
                            </div>
                            
                            {request.senderId !== user?.id ? (
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleRequest(request.id, 'accepted')}
                                        className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 transition-colors"
                                    >
                                    <Check className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => handleRequest(request.id, 'rejected')}
                                        className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                                    >
                                    <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <span className="text-sm text-muted-foreground italic">Pending...</span>
                            )}
                            </div>
                        ))
                        )}
                    </div>
                    )}

                    {activeTab === "chat" && (
                    <div className="space-y-3">
                        {!activeChatFriend ? (
                            <div className="flex flex-col h-[450px]">
                                <div className="text-center py-6 border-b border-white/5">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 ring-1 ring-primary/30">
                                        <MessageCircle className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-display font-bold mb-2">Start a Conversation</h3>
                                    <p className="text-sm text-muted-foreground">Choose a friend from your pack to chat with</p>
                                </div>
                                
                                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2 mt-4">
                                    {friends.length === 0 ? (
                                        <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed border-white/10">
                                            <p className="text-muted-foreground">No friends found.</p>
                                            <button onClick={() => setActiveTab("requests")} className="text-primary text-sm mt-2 hover:underline">
                                                Check requests
                                            </button>
                                        </div>
                                    ) : (
                                        friends.map(friend => (
                                            <button
                                                key={friend.id}
                                                onClick={() => startChat(friend)}
                                                className="w-full flex items-center gap-4 p-4 rounded-xl bg-muted/20 hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all group"
                                            >
                                                <div className="relative">
                                                    <div className="w-12 h-12 rounded-xl overflow-hidden ring-1 ring-white/10 group-hover:scale-105 transition-transform bg-muted/20">
                                                        <img 
                                                            src={friend.avatar === 'panther' ? pantherImg : friend.avatar === 'snake' ? snakeImg : owlImg} 
                                                            alt={friend.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                                                </div>
                                                
                                                <div className="flex-1 text-left">
                                                    <span className="font-bold block text-lg group-hover:text-primary transition-colors">{friend.name}</span>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        Level {friend.gameProgress?.currentLevel || 1} • <span className="text-green-400">Online</span>
                                                    </span>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-background/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <ArrowRight className="w-4 h-4 text-primary" />
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col h-[400px]">
                                <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-4">
                                    <button onClick={() => setActiveChatFriend(null)}>
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    <span className="font-bold text-lg">{activeChatFriend.name}</span>
                                </div>
                                <div className="flex-1 overflow-y-auto space-y-3 px-2 mb-4">
                                     {messages.map((msg, offset) => (
                                        <div
                                            key={offset}
                                            className={`flex flex-col ${msg.senderId === user?.id ? "items-end" : "items-start"} mb-2`}
                                        >
                                            <div className={`p-3 rounded-xl max-w-[80%] ${
                                                msg.senderId === user?.id 
                                                    ? "bg-primary text-primary-foreground rounded-br-none" 
                                                    : "bg-muted rounded-bl-none"
                                            }`}>
                                                <p className="text-sm">{msg.content}</p>
                                            </div>
                                            <span className="text-[10px] text-muted-foreground mt-1 px-1">
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                     ))}
                                </div>
                                <div className="flex gap-3">
                                <input
                                    type="text"
                                    placeholder="Send a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="input-glass flex-1"
                                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                />
                                <button onClick={sendMessage} className="btn-jungle px-4">
                                    <Send className="w-5 h-5" />
                                </button>
                                </div>
                            </div>
                        )}
                    </div>
                    )}
                </>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Social;
