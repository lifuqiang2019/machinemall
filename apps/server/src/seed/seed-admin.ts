import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  const adminEmail = 'admin@machinemall.com';
  const adminPassword = 'admin'; // You can change this
  const adminName = 'Administrator';

  const existingAdmin = await usersService.findByEmail(adminEmail);

  if (existingAdmin) {
    console.log('Admin user already exists.');
  } else {
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    // We need to bypass the standard create method if it doesn't support setting ID or specific fields directly if needed,
    // but usersService.create should be fine if it allows setting role.
    // Let's check usersService.create signature or use repository directly if needed.
    // Assuming usersService.create handles basic user creation.
    
    // However, looking at previous context, create takes a Partial<User>.
    // Let's use the repository directly to be safe and ensure role is set to 'admin'.
    
    const userRepo = app.get('UserRepository'); // Attempt to get repository by token if registered that way, 
                                                // or get it via UsersService if it exposes it.
                                                // Easier: UsersService usually has a create method.
    
    try {
        await usersService.create({
            email: adminEmail,
            name: adminName,
            password: hashedPassword,
            role: 'admin',
            emailVerified: true,
        } as any);
        console.log(`Admin user created successfully.`);
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
    } catch (error) {
        console.error('Failed to create admin user:', error);
    }
  }

  await app.close();
}

bootstrap();
