export declare class User {
    id: string;
    email: string;
    name: string;
    password?: string;
    role: string;
    image?: string;
    emailVerified: boolean;
    verificationCode?: string | null;
    verificationCodeExpires?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
