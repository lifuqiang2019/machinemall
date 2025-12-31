"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const chat_service_1 = require("./chat.service");
let ChatGateway = class ChatGateway {
    chatService;
    server;
    constructor(chatService) {
        this.chatService = chatService;
    }
    admins = new Set();
    users = new Map();
    handleConnection(client) {
    }
    handleDisconnect(client) {
        this.admins.delete(client.id);
        this.users.delete(client.id);
    }
    async handleJoinChat(client, payload) {
        if (payload.role === 'admin') {
            client.join('admin_room');
            this.admins.add(client.id);
            const conversations = await this.chatService.getActiveConversations();
            client.emit('active_conversations', conversations);
        }
        else {
            const roomId = `user_${payload.userId}`;
            client.join(roomId);
            this.users.set(client.id, payload);
            const history = await this.chatService.getMessagesByUser(payload.userId);
            client.emit('message_history', history);
            this.server.to('admin_room').emit('user_connected', payload);
        }
    }
    async handleAdminFetchHistory(client, payload) {
        const history = await this.chatService.getMessagesByUser(payload.userId);
        client.emit('admin_user_history', {
            userId: payload.userId,
            messages: history,
        });
    }
    async handleClientMessage(client, payload) {
        const message = await this.chatService.createMessage(payload.userId, payload.name, payload.content, 'user');
        this.server.to('admin_room').emit('admin_receive_message', {
            ...payload,
            timestamp: message.createdAt,
        });
    }
    async handleAdminMessage(client, payload) {
        const message = await this.chatService.createMessage(payload.targetUserId, payload.adminName, payload.content, 'admin');
        const targetRoom = `user_${payload.targetUserId}`;
        this.server.to(targetRoom).emit('client_receive_message', {
            content: payload.content,
            sender: 'admin',
            name: payload.adminName,
            timestamp: message.createdAt,
        });
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_chat'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleJoinChat", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('admin_fetch_history'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleAdminFetchHistory", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('client_message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleClientMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('admin_message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleAdminMessage", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map