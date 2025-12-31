import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  // Track active admin connections
  private admins: Set<string> = new Set();
  // Track active user connections: socketId -> userId (or session ID)
  private users: Map<string, any> = new Map();

  handleConnection(client: Socket) {
    // console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    // console.log(`Client disconnected: ${client.id}`);
    this.admins.delete(client.id);
    this.users.delete(client.id);
  }

  @SubscribeMessage('join_chat')
  async handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { userId: string; name: string; role?: string },
  ) {
    if (payload.role === 'admin') {
      client.join('admin_room');
      this.admins.add(client.id);
      // Load active conversations for admin
      const conversations = await this.chatService.getActiveConversations();
      client.emit('active_conversations', conversations);
    } else {
      // User joins their own room identified by userId
      const roomId = `user_${payload.userId}`;
      client.join(roomId);
      this.users.set(client.id, payload);
      
      // Load user history
      const history = await this.chatService.getMessagesByUser(payload.userId);
      client.emit('message_history', history);
      
      // Notify admins that a user is active/online
      this.server.to('admin_room').emit('user_connected', payload);
    }
  }

  @SubscribeMessage('admin_fetch_history')
  async handleAdminFetchHistory(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { userId: string },
  ) {
    const history = await this.chatService.getMessagesByUser(payload.userId);
    client.emit('admin_user_history', {
      userId: payload.userId,
      messages: history,
    });
  }

  @SubscribeMessage('client_message')
  async handleClientMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { userId: string; content: string; name: string },
  ) {
    // Save message
    const message = await this.chatService.createMessage(
      payload.userId,
      payload.name,
      payload.content,
      'user',
    );

    // Forward to Admins
    this.server.to('admin_room').emit('admin_receive_message', {
      ...payload,
      timestamp: message.createdAt,
    });
  }

  @SubscribeMessage('admin_message')
  async handleAdminMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { targetUserId: string; content: string; adminName: string },
  ) {
    // Save message
    const message = await this.chatService.createMessage(
      payload.targetUserId,
      payload.adminName,
      payload.content,
      'admin',
    );

    // Forward to specific User
    const targetRoom = `user_${payload.targetUserId}`;
    this.server.to(targetRoom).emit('client_receive_message', {
      content: payload.content,
      sender: 'admin',
      name: payload.adminName,
      timestamp: message.createdAt,
    });
  }
}
