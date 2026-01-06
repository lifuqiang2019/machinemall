import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { Repository } from 'typeorm';
import { VerificationCode } from './entities/verification-code.entity';
export declare class AuthService {
    private usersService;
    private jwtService;
    private emailService;
    private verificationCodeRepository;
    constructor(usersService: UsersService, jwtService: JwtService, emailService: EmailService, verificationCodeRepository: Repository<VerificationCode>);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            image: any;
        };
    }>;
    sendVerificationCode(email: string): Promise<{
        message: string;
    }>;
    register(registerDto: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            image: any;
        };
    }>;
}
