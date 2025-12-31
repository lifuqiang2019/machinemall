import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatService;
    server: Server;
    constructor(chatService: ChatService);
    private admins;
    private users;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinChat(client: Socket, payload: {
        userId: string;
        name: string;
        role?: string;
    }): Promise<void>;
    handleAdminFetchHistory(client: Socket, payload: {
        userId: string;
    }): Promise<void>;
    handleClientMessage(client: Socket, payload: {
        userId: string;
        content: string;
        name: string;
    }): Promise<void>;
    handleAdminMessage(client: Socket, payload: {
        targetUserId: string;
        content: string;
        adminName: string;
    }): Promise<void>;
}
