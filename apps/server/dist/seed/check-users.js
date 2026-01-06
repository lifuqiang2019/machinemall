"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const users_service_1 = require("../users/users.service");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const usersService = app.get(users_service_1.UsersService);
    console.log('Checking users in database...');
    const users = await usersService.findAll();
    console.log(`Found ${users.length} users.`);
    users.forEach(u => {
        console.log(`- ${u.email} (${u.role}) id: ${u.id}`);
    });
    await app.close();
}
bootstrap();
//# sourceMappingURL=check-users.js.map