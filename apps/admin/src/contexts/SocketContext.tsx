import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  unreadCount: number;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  unreadCount: 0,
  setUnreadCount: () => {},
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:3000', {
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      // console.log('Global Socket connected');
      setIsConnected(true);
      newSocket.emit('join_chat', {
        userId: 'admin',
        name: 'Admin',
        role: 'admin',
      });
    });

    newSocket.on('disconnect', () => {
        setIsConnected(false);
    });

    newSocket.on('active_conversations', (conversations: any[]) => {
      let count = 0;
      conversations.forEach((c) => {
        if (c.unread) count += c.unread;
      });
      setUnreadCount(count);
    });

    newSocket.on('admin_receive_message', (msg: any) => {
      // Logic: If we are not in ChatPage (or handled there), we increment.
      // But actually, ChatPage also listens.
      // A simple strategy: ALWAYS increment here. ChatPage will decrement when user clicks/reads.
      // But wait, if ChatPage is open and we are looking at that user, we shouldn't increment or should clear immediately.
      // For now, let's just increment. The UI will update.
      // ChatPage needs to call setUnreadCount to adjust when reading.
      // HOWEVER, calculating the diff is hard.
      // BETTER: On 'admin_receive_message', we just increment.
      // When ChatPage "reads" a message, it should deduct.
      
      // Let's refine: The server sends unread count in active_conversations.
      // Maybe we just increment simply here.
      setUnreadCount((prev) => prev + 1);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, unreadCount, setUnreadCount, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
