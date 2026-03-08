import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import useAuthStore from '../store/authStore';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socketInstance = null;

const useSocket = () => {
  const { accessToken } = useAuthStore();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!accessToken) return;

    if (!socketInstance) {
      socketInstance = io(SOCKET_URL, {
        auth: { token: accessToken },
        transports: ['websocket'],
        autoConnect: true,
        reconnectionAttempts: 5,
      });
    }

    socketRef.current = socketInstance;

    return () => {
      // don't disconnect on unmount — keep singleton alive
    };
  }, [accessToken]);

  return socketRef.current;
};

export const getSocket = () => socketInstance;

export default useSocket;
