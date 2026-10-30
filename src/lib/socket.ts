// ====================================================================
// REALTIME SOCKET.IO CLIENT
// ====================================================================

import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    // In Vite dev mode, socket.io is proxied via /socket.io, or points to port 3001
    const serverUrl = window.location.port === '5173' ? 'http://localhost:3001' : window.location.origin;
    socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('⚡ Connected to EMBEDX Realtime Engine with ID:', socket?.id);
    });

    socket.on('connect_error', (err) => {
      console.warn('Socket connection warning (will retry):', err.message);
    });
  }
  return socket;
}

