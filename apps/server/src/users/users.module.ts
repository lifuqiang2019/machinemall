import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Session } from './entities/session.entity';
import { Account } from './entities/account.entity';
import { Verification } from './entities/verification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Session, Account, Verification])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Export UsersService for AuthModule
})
export class UsersModule {}
