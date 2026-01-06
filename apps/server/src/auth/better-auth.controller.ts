import { Controller, All, Req, Res } from '@nestjs/common';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth-server';

@Controller('api/auth')
export class BetterAuthController {
    @All('*') // This matches /api/auth/* but we need to ensure it captures sub-paths correctly
    async handleAuth(@Req() req: any, @Res() res: any) {
        return toNodeHandler(auth)(req, res);
    }
}