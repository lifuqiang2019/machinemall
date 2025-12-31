import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
export declare class ChatService {
    private messageRepository;
    constructor(messageRepository: Repository<Message>);
    createMessage(userId: string, userName: string, content: string, sender: 'user' | 'admin'): Promise<Message>;
    getMessagesByUser(userId: string): Promise<Message[]>;
    getActiveConversations(): Promise<any[]>;
}
