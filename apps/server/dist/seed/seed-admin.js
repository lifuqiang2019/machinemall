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
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const users_service_1 = require("../users/users.service");
const bcrypt = __importStar(require("bcrypt"));
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const usersService = app.get(users_service_1.UsersService);
    const adminEmail = 'admin@machinemall.com';
    const adminPassword = 'admin';
    const adminName = 'Administrator';
    const existingAdmin = await usersService.findByEmail(adminEmail);
    if (existingAdmin) {
        console.log('Admin user already exists.');
    }
    else {
        console.log('Creating admin user...');
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const userRepo = app.get('UserRepository');
        try {
            await usersService.create({
                email: adminEmail,
                name: adminName,
                password: hashedPassword,
                role: 'admin',
                emailVerified: true,
            });
            console.log(`Admin user created successfully.`);
            console.log(`Email: ${adminEmail}`);
            console.log(`Password: ${adminPassword}`);
        }
        catch (error) {
            console.error('Failed to create admin user:', error);
        }
    }
    await app.close();
}
bootstrap();
//# sourceMappingURL=seed-admin.js.map