export declare class Message {
    id: number;
    userId: string;
    userName: string;
    content: string;
    sender: 'user' | 'admin';
    isRead: boolean;
    createdAt: Date;
}
