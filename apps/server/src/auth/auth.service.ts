import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && user.password) {
        // Simple check if password is not hashed (for initial setup/migration)
        if (user.password === pass) return { ...user };
        // If password is hashed (starts with $2b$ or similar, but bcrypt.compare handles it)
        const isMatch = await bcrypt.compare(pass, user.password);
        if (isMatch) {
            const { password, ...result } = user;
            return result;
        }
    }
    // Fallback for demo: if user exists but no password set, allow or fail? 
    // Let's assume strict.
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
