"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const email_service_1 = require("../email/email.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const verification_code_entity_1 = require("./entities/verification-code.entity");
let AuthService = class AuthService {
    usersService;
    jwtService;
    emailService;
    verificationCodeRepository;
    constructor(usersService, jwtService, emailService, verificationCodeRepository) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.verificationCodeRepository = verificationCodeRepository;
    }
    async validateUser(email, pass) {
        const user = await this.usersService.findByEmail(email);
        console.log(`[AuthService] Validating user: ${email}`, user ? 'Found' : 'Not Found');
        if (user && user.password) {
            if (user.password === pass) {
                console.log('[AuthService] Password matched (plain text)');
                return { ...user };
            }
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
    async login(user) {
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
    async sendVerificationCode(email) {
        const user = await this.usersService.findByEmail(email);
        if (user) {
            throw new common_1.BadRequestException('User already exists. Please log in.');
        }
        const existingCode = await this.verificationCodeRepository.findOne({ where: { email } });
        if (existingCode) {
            const sentTime = existingCode.updatedAt || existingCode.createdAt;
            const timeSinceSent = new Date().getTime() - sentTime.getTime();
            if (timeSinceSent < 60000) {
                const remainingSeconds = Math.ceil((60000 - timeSinceSent) / 1000);
                throw new common_1.BadRequestException(`Please wait ${remainingSeconds} seconds before requesting a new code`);
            }
        }
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + 10);
        if (existingCode) {
            existingCode.code = code;
            existingCode.expiresAt = expires;
            await this.verificationCodeRepository.save(existingCode);
        }
        else {
            await this.verificationCodeRepository.save({
                email,
                code,
                expiresAt: expires,
            });
        }
        this.emailService.sendVerificationCode(email, code).catch(error => {
            console.error(`[Email Service] Failed to send code to ${email}:`, error.message);
        });
        console.log(`\n==================================================`);
        console.log(`[DEV HELPER] Verification Code for ${email}: ${code}`);
        console.log(`==================================================\n`);
        return { message: 'Verification code sent' };
    }
    async register(registerDto) {
        const { email, password, code } = registerDto;
        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser) {
            throw new common_1.BadRequestException('User already exists');
        }
        const verificationEntry = await this.verificationCodeRepository.findOne({ where: { email } });
        if (!verificationEntry) {
            throw new common_1.BadRequestException('Please request a verification code first');
        }
        if (verificationEntry.code !== code) {
            throw new common_1.BadRequestException('Invalid verification code');
        }
        if (new Date() > verificationEntry.expiresAt) {
            throw new common_1.BadRequestException('Verification code expired');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await this.usersService.create({
            email,
            name: email.split('@')[0],
            password: hashedPassword,
            role: 'user',
            emailVerified: true
        });
        await this.verificationCodeRepository.delete(verificationEntry.id);
        return this.login(newUser);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, typeorm_1.InjectRepository)(verification_code_entity_1.VerificationCode)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        email_service_1.EmailService,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map