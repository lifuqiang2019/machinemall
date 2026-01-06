import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            image: any;
        };
    }>;
    sendCode(body: {
        email: string;
    }): Promise<{
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
