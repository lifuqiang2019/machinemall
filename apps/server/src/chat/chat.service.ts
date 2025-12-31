import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async createMessage(
    userId: string,
    userName: string,
    content: string,
    sender: 'user' | 'admin',
  ) {
    const message = this.messageRepository.create({
      userId,
      userName,
      content,
      sender,
    });
    return this.messageRepository.save(message);
  }

  async getMessagesByUser(userId: string) {
    return this.messageRepository.find({
      where: { userId },
      order: { createdAt: 'ASC' },
    });
  }

  async getActiveConversations() {
    // Get distinct userIds and their latest message
    // This is a simplified approach. For production, use a more optimized query.
    const messages = await this.messageRepository.find({
        order: { createdAt: 'DESC' }
    });
    
    const conversations = new Map<string, any>();
    
    messages.forEach(msg => {
        if (!conversations.has(msg.userId)) {
            // Initialize conversation with the latest message
            conversations.set(msg.userId, {
                userId: msg.userId,
                // If latest message is from user, use their name. Otherwise use placeholder.
                name: msg.sender === 'user' ? msg.userName : 'Guest', 
                messages: [], 
                lastMessage: msg,
                unread: 0 
            });
        } else {
            // If we already have the conversation but the name is 'Guest' (because latest msg was admin),
            // and now we found a user message, update the name.
            const conversation = conversations.get(msg.userId);
            if (conversation.name === 'Guest' && msg.sender === 'user') {
                conversation.name = msg.userName;
            }
        }
    });

    return Array.from(conversations.values());
  }
}
