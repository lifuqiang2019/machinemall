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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const message_entity_1 = require("./entities/message.entity");
let ChatService = class ChatService {
    messageRepository;
    constructor(messageRepository) {
        this.messageRepository = messageRepository;
    }
    async createMessage(userId, userName, content, sender) {
        const message = this.messageRepository.create({
            userId,
            userName,
            content,
            sender,
        });
        return this.messageRepository.save(message);
    }
    async getMessagesByUser(userId) {
        return this.messageRepository.find({
            where: { userId },
            order: { createdAt: 'ASC' },
        });
    }
    async getActiveConversations() {
        const messages = await this.messageRepository.find({
            order: { createdAt: 'DESC' }
        });
        const conversations = new Map();
        messages.forEach(msg => {
            if (!conversations.has(msg.userId)) {
                conversations.set(msg.userId, {
                    userId: msg.userId,
                    name: msg.sender === 'user' ? msg.userName : 'Guest',
                    messages: [],
                    lastMessage: msg,
                    unread: 0
                });
            }
            else {
                const conversation = conversations.get(msg.userId);
                if (conversation.name === 'Guest' && msg.sender === 'user') {
                    conversation.name = msg.userName;
                }
            }
        });
        return Array.from(conversations.values());
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ChatService);
//# sourceMappingURL=chat.service.js.map