import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EmailService } from '../email/email.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerificationCode } from './entities/verification-code.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
    @InjectRepository(VerificationCode)
    private verificationCodeRepository: Repository<VerificationCode>,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    console.log(`[AuthService] Validating user: ${email}`, user ? 'Found' : 'Not Found');
    
    if (user && user.password) {
        // Simple check if password is not hashed (for initial setup/migration)
        if (user.password === pass) {
            console.log('[AuthService] Password matched (plain text)');
            return { ...user };
        }
        // If password is hashed (starts with $2b$ or similar, but bcrypt.compare handles it)
        const isMatch = await bcrypt.compare(pass, user.password);
        console.log(`[AuthService] Password match (bcrypt): ${isMatch}`);
        if (isMatch) {
            const { password, ...result } = user;
            return result;
        }
    }
    console.log('[AuthService] Validation failed');
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image
      }
    };
  }

  async sendVerificationCode(email: string) {
    const user = await this.usersService.findByEmail(email);
    
    // Check if user exists before sending code
    if (user) {
        throw new BadRequestException('User already exists. Please log in.');
    }

    // Check for existing verification code for rate limiting
    const existingCode = await this.verificationCodeRepository.findOne({ where: { email } });
    
    if (existingCode) {
        // Rate limiting check
        const sentTime = existingCode.updatedAt || existingCode.createdAt;
        const timeSinceSent = new Date().getTime() - sentTime.getTime();
        if (timeSinceSent < 60000) { // 60 seconds cooldown
            const remainingSeconds = Math.ceil((60000 - timeSinceSent) / 1000);
            throw new BadRequestException(`Please wait ${remainingSeconds} seconds before requesting a new code`);
        }
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 10); // 10 minutes expiry

    // Save code to VerificationCode table instead of User table
    if (existingCode) {
        existingCode.code = code;
        existingCode.expiresAt = expires;
        await this.verificationCodeRepository.save(existingCode);
    } else {
        await this.verificationCodeRepository.save({
            email,
            code,
            expiresAt: expires,
        });
    }

    // Send email asynchronously
    this.emailService.sendVerificationCode(email, code).catch(error => {
        console.error(`[Email Service] Failed to send code to ${email}:`, error.message);
    });

    // Log code to console for development
    console.log(`\n==================================================`);
    console.log(`[DEV HELPER] Verification Code for ${email}: ${code}`);
    console.log(`==================================================\n`);

    return { message: 'Verification code sent' };
  }

  async register(registerDto: any) {
    const { email, password, code } = registerDto;
    
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
        throw new BadRequestException('User already exists');
    }

    // Check verification code
    const verificationEntry = await this.verificationCodeRepository.findOne({ where: { email } });
    
    if (!verificationEntry) {
        throw new BadRequestException('Please request a verification code first');
    }

    if (verificationEntry.code !== code) {
        throw new BadRequestException('Invalid verification code');
    }

    if (new Date() > verificationEntry.expiresAt) {
        throw new BadRequestException('Verification code expired');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await this.usersService.create({
        email,
        name: email.split('@')[0],
        password: hashedPassword,
        role: 'user',
        emailVerified: true
    } as any);

    // Clean up verification code
    await this.verificationCodeRepository.delete(verificationEntry.id);

    // Auto login
    return this.login(newUser);
  }
}
