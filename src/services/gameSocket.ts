import io, { Socket } from 'socket.io-client';
import { API_URL } from '../config';

const SOCKET_URL = API_URL;

class GameSocketService {
  public socket: Socket | null = null;
  
  connect(token: string) {
    if (this.socket) return;
    
    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected to Game Socket');
    });

    this.socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Emitters
  joinQueue(userId: string, name: string) {
    this.socket?.emit('joinQueue', { userId, name });
  }

  createPrivateRoom(userId: string, name: string) {
    this.socket?.emit('createPrivateRoom', { userId, name });
  }

  joinPrivateRoom(userId: string, name: string, roomCode: string) {
    this.socket?.emit('joinPrivateRoom', { userId, name, roomCode });
  }

  makeMove(roomId: string, choice: 'rock' | 'paper' | 'scissors') {
    this.socket?.emit('makeMove', { roomId, choice });
  }

  // Listeners
  onMatchFound(callback: (data: any) => void) {
    this.socket?.on('matchFound', callback);
  }

  onPrivateRoomCreated(callback: (data: { roomCode: string }) => void) {
    this.socket?.on('privateRoomCreated', callback);
  }

  onOpponentMadeMove(callback: (data: any) => void) {
    this.socket?.on('opponentMadeMove', callback);
  }

  onRoundResult(callback: (data: any) => void) {
    this.socket?.on('roundResult', callback);
  }

  onNextRound(callback: (data: any) => void) {
    this.socket?.on('nextRound', callback);
  }

  onGameOver(callback: (data: any) => void) {
    this.socket?.on('gameOver', callback);
  }

  onOpponentLeft(callback: (data: any) => void) {
    this.socket?.on('opponentLeft', callback);
  }

  onError(callback: (data: { message: string }) => void) {
    this.socket?.on('error', callback);
  }

  // Chat Methods
  registerUser(userId: string) {
    this.socket?.emit('register', { userId });
  }

  sendMessage(senderId: string, receiverId: string, content: string) {
    this.socket?.emit('sendMessage', { senderId, receiverId, content });
  }

  onNewMessage(callback: (data: any) => void) {
    this.socket?.on('newMessage', callback);
  }

  onMessageSent(callback: (data: any) => void) {
    this.socket?.on('messageSent', callback);
  }

  onNewFriendRequest(callback: (data: any) => void) {
    this.socket?.on('newFriendRequest', callback);
  }
}

export const gameSocketService = new GameSocketService();
