import { io, Socket } from 'socket.io-client';
import { API_URL } from '../config';

const URL = API_URL;

// Create socket instance
export const socket: Socket = io(URL, {
  autoConnect: false,
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
});
