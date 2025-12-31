import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string; // The user involved in the conversation

  @Column()
  userName: string; // User's name for display

  @Column()
  content: string;

  @Column()
  sender: 'user' | 'admin';

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
