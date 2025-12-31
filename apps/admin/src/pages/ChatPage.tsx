import React, { useEffect, useState, useRef } from 'react';
import { Layout, List, Avatar, Input, Button, Badge, Typography } from 'antd';
import { UserOutlined, SendOutlined } from '@ant-design/icons';
import { useSocket } from '../contexts/SocketContext';

const { Content, Sider } = Layout;
const { Text } = Typography;

interface Message {
  content: string;
  sender: 'user' | 'admin';
  name: string;
  timestamp: Date;
}

interface UserSession {
  userId: string;
  name: string;
  messages: Message[];
  unread: number;
}

const ChatPage: React.FC = () => {
  const { socket, setUnreadCount } = useSocket();
  const [activeUsers, setActiveUsers] = useState<UserSession[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectedUserIdRef = useRef<string | null>(null);

  // Sync ref with state
  useEffect(() => {
    selectedUserIdRef.current = selectedUserId;
  }, [selectedUserId]);

  useEffect(() => {
    if (!socket) return;

    // Listen for incoming messages
    const handleAdminReceiveMessage = (msg: any) => {
      setActiveUsers((prev) => {
        const existingUserIndex = prev.findIndex((u) => u.userId === msg.userId);
        const newMessage = {
          content: msg.content,
          sender: 'user' as const,
          name: msg.name,
          timestamp: new Date(msg.timestamp),
        };

        if (existingUserIndex >= 0) {
          // Create a new object for the updated user to avoid mutation
          const updatedUser = {
            ...prev[existingUserIndex],
            messages: [...prev[existingUserIndex].messages, newMessage],
            unread: msg.userId !== selectedUserIdRef.current 
              ? prev[existingUserIndex].unread + 1 
              : prev[existingUserIndex].unread
          };

          // Remove the user from current position and add to top
          const otherUsers = prev.filter((_, index) => index !== existingUserIndex);
          return [updatedUser, ...otherUsers];
        } else {
          return [
            {
              userId: msg.userId,
              name: msg.name,
              messages: [newMessage],
              unread: msg.userId === selectedUserIdRef.current ? 0 : 1,
            },
            ...prev,
          ];
        }
      });
    };

    // Listen for initial list of conversations
    const handleActiveConversations = (conversations: any[]) => {
        // Transform backend data to frontend structure if needed
        const formattedUsers = conversations.map(c => ({
            userId: c.userId,
            name: c.name || 'Guest',
            messages: c.lastMessage ? [{
                content: c.lastMessage.content,
                sender: c.lastMessage.sender,
                name: c.lastMessage.userName,
                timestamp: new Date(c.lastMessage.createdAt)
            }] : [],
            unread: c.unread || 0
        }));
        setActiveUsers(formattedUsers);
    };

    // Listen for user history
    const handleAdminUserHistory = (data: { userId: string, messages: any[] }) => {
        setActiveUsers(prev => prev.map(u => {
            if (u.userId === data.userId) {
                return {
                    ...u,
                    messages: data.messages.map(m => ({
                        content: m.content,
                        sender: m.sender,
                        name: m.userName || (m.sender === 'admin' ? 'Support Agent' : u.name),
                        timestamp: new Date(m.createdAt)
                    }))
                };
            }
            return u;
        }));
    };
    
    // Optional: Handle user connection event to populate list even without messages
    const handleUserConnected = (user: any) => {
         setActiveUsers((prev) => {
            if (prev.find(u => u.userId === user.userId)) return prev;
            return [{
                userId: user.userId,
                name: user.name,
                messages: [],
                unread: 0
            }, ...prev];
         });
    };

    socket.on('admin_receive_message', handleAdminReceiveMessage);
    socket.on('active_conversations', handleActiveConversations);
    socket.on('admin_user_history', handleAdminUserHistory);
    socket.on('user_connected', handleUserConnected);
    
    // Re-request active conversations when mounting ChatPage to ensure sync
    socket.emit('join_chat', { userId: 'admin', name: 'Admin', role: 'admin' });

    return () => {
      socket.off('admin_receive_message', handleAdminReceiveMessage);
      socket.off('active_conversations', handleActiveConversations);
      socket.off('admin_user_history', handleAdminUserHistory);
      socket.off('user_connected', handleUserConnected);
    };
  }, [socket]); // Dependency on socket ensures listeners are attached when socket is available

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeUsers, selectedUserId]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !selectedUserId || !socket) return;

    const targetUser = activeUsers.find((u) => u.userId === selectedUserId);
    if (!targetUser) return;

    const payload = {
      targetUserId: selectedUserId,
      content: inputMessage,
      adminName: 'Support Agent',
    };

    socket.emit('admin_message', payload);

    // Update local state
    setActiveUsers((prev) =>
      prev.map((u) => {
        if (u.userId === selectedUserId) {
          return {
            ...u,
            messages: [
              ...u.messages,
              {
                content: inputMessage,
                sender: 'admin',
                name: 'You',
                timestamp: new Date(),
              },
            ],
          };
        }
        return u;
      })
    );

    setInputMessage('');
  };

  const selectedUser = activeUsers.find((u) => u.userId === selectedUserId);

  return (
    <Layout style={{ height: 'calc(100vh - 100px)', background: '#fff' }}>
      <Sider width={300} style={{ background: '#fff', borderRight: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
          <Text strong>Active Conversations</Text>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
            <List
              rowKey="userId"
              itemLayout="horizontal"
              dataSource={activeUsers}
              renderItem={(item) => (
                <List.Item
                  onClick={() => {
                    setSelectedUserId(item.userId);
                    // Fetch full history
                    if (socket) {
                        socket.emit('admin_fetch_history', { userId: item.userId });
                    }
                    
                    // Decrement global unread count
                    const unread = item.unread;
                    if (unread > 0) {
                        setUnreadCount(prev => Math.max(0, prev - unread));
                    }

                    // Clear unread local
                    setActiveUsers((prev) =>
                      prev.map((u) => (u.userId === item.userId ? { ...u, unread: 0 } : u))
                    );
                  }}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    background: selectedUserId === item.userId ? '#e6f7ff' : 'transparent',
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge count={item.unread}>
                        <Avatar icon={<UserOutlined />} />
                      </Badge>
                    }
                    title={item.name}
                    description={
                      <Text type="secondary" ellipsis>
                        {item.messages.length > 0
                          ? item.messages[item.messages.length - 1].content
                          : 'No messages yet'}
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
        </div>
      </Sider>
      <Content style={{ display: 'flex', flexDirection: 'column' }}>
        {selectedUserId ? (
          <>
            <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
              <Text strong>{selectedUser?.name}</Text>
            </div>
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', background: '#f5f5f5' }}>
              {selectedUser?.messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: msg.sender === 'admin' ? 'flex-end' : 'flex-start',
                    marginBottom: '8px',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '70%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: msg.sender === 'admin' ? '#1890ff' : '#fff',
                      color: msg.sender === 'admin' ? '#fff' : '#000',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    }}
                  >
                    <div>{msg.content}</div>
                    <div
                      style={{
                        fontSize: '10px',
                        textAlign: 'right',
                        opacity: 0.7,
                        marginTop: '4px',
                      }}
                    >
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div style={{ padding: '16px', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onPressEnter={handleSendMessage}
                  placeholder="Type a message..."
                />
                <Button type="primary" icon={<SendOutlined />} onClick={handleSendMessage}>
                  Send
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#ccc',
            }}
          >
            Select a conversation to start chatting
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default ChatPage;
