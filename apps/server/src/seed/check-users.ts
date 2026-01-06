import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  console.log('Checking users in database...');
  const users = await usersService.findAll();
  console.log(`Found ${users.length} users.`);
  users.forEach(u => {
      console.log(`- ${u.email} (${u.role}) id: ${u.id}`);
  });

  await app.close();
}

bootstrap();
