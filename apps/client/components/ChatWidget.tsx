"use client";

import React, { useEffect, useState, useRef } from "react";
import { MessageSquare, X, Send, Minus } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

interface Message {
  content: string;
  sender: "user" | "admin";
  name: string;
  timestamp: Date;
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { data: session } = authClient.useSession();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Listen for open-chat event
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener("open-chat", handleOpenChat);
    return () => window.removeEventListener("open-chat", handleOpenChat);
  }, []);

  useEffect(() => {
    // Only connect if we have a user and NO socket
    if (!session?.user) return;
    
    // Connect to backend (assuming port 3000)
    const newSocket = io("http://localhost:3000", {
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        transports: ['websocket'], // Force websocket to avoid polling issues
    });
    
    setSocket(newSocket);

    const handleConnect = () => {
        setIsConnected(true);
        newSocket.emit("join_chat", {
            userId: session.user.id,
            name: session.user.name,
            role: "user"
        });
    };

    const handleDisconnect = () => {
        setIsConnected(false);
    };

    const handleMessageHistory = (history: any[]) => {
        setMessages(history.map(msg => ({
            content: msg.content,
            sender: msg.sender,
            name: msg.userName,
            timestamp: new Date(msg.createdAt)
        })));
    };

    const handleClientReceiveMessage = (msg: any) => {
        setMessages((prev) => [...prev, {
            content: msg.content,
            sender: "admin",
            name: msg.name,
            timestamp: new Date(msg.timestamp)
        }]);
    };

    newSocket.on("connect", handleConnect);
    newSocket.on("disconnect", handleDisconnect);
    newSocket.on("message_history", handleMessageHistory);
    newSocket.on("client_receive_message", handleClientReceiveMessage);

    return () => {
        newSocket.off("connect", handleConnect);
        newSocket.off("disconnect", handleDisconnect);
        newSocket.off("message_history", handleMessageHistory);
        newSocket.off("client_receive_message", handleClientReceiveMessage);
        newSocket.disconnect();
        setSocket(null);
        setIsConnected(false);
    };
  }, [session?.user?.id]); // Only recreate if user ID changes

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]); // Scroll when messages change OR when opened

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    if (!socket || !isConnected) {
        console.error("Socket not connected", { socket: !!socket, isConnected });
        return;
    }

    const messagePayload = {
      userId: session.user.id,
      name: session.user.name,
      content: inputMessage,
    };

    try {
        socket.emit("client_message", messagePayload);
        
        // Optimistic update
        setMessages((prev) => [...prev, {
            content: inputMessage,
            sender: "user",
            name: session.user.name,
            timestamp: new Date()
        }]);
        
        setInputMessage("");
    } catch (err) {
        console.error("Failed to send message", err);
    }
  };

  if (!session?.user && isOpen) {
    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <div className="bg-white w-[300px] p-6 rounded-2xl shadow-2xl border border-gray-100 flex flex-col gap-4 animate-in slide-in-from-bottom-5 duration-300 relative">
                <button 
                    onClick={() => setIsOpen(false)} 
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                >
                    <X size={18} />
                </button>
                <div className="text-center">
                    <div className="w-12 h-12 bg-blue-50 text-[#0154A6] rounded-full flex items-center justify-center mx-auto mb-3">
                        <MessageSquare size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">Live Chat</h3>
                    <p className="text-sm text-gray-500 mb-4">Please sign in to start chatting with our support team.</p>
                    <Link 
                        href="/login" 
                        className="block w-full bg-[#0154A6] text-white text-center py-2 rounded-lg font-medium hover:bg-[#014486] transition-colors"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
  }

  if (!session?.user) return null; // Only show button if logged in (or if open handled above)

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen ? (
        <div className="bg-white w-[350px] h-[500px] rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-[#0154A6] p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
                <div className="relative">
                    <div className="w-2 h-2 bg-green-400 rounded-full absolute bottom-0 right-0 border border-[#0154A6]"></div>
                    <MessageSquare size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-sm">Customer Support</h3>
                    <p className="text-[10px] text-white/70">We typically reply in a few minutes</p>
                </div>
            </div>
            <div className="flex gap-2">
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded transition-colors">
                    <Minus size={18} />
                </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.length === 0 && (
                <div className="text-center text-gray-400 text-sm mt-10">
                    <p>👋 Hi {session.user.name}!</p>
                    <p>How can we help you today?</p>
                </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col max-w-[80%] ${
                  msg.sender === "user" ? "self-end items-end" : "self-start items-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl text-sm ${
                    msg.sender === "user"
                      ? "bg-[#0154A6] text-white rounded-tr-none"
                      : "bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm"
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0154A6]/20"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="bg-[#0154A6] text-white p-2 rounded-xl hover:bg-[#014486] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#0154A6] hover:bg-[#014486] text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 group"
        >
          <MessageSquare size={28} className="group-hover:animate-pulse" />
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
