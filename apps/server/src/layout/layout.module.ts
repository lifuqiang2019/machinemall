import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LayoutService } from './layout.service';
import { LayoutController } from './layout.controller';
import { Layout } from './entities/layout.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Layout])],
  controllers: [LayoutController],
  providers: [LayoutService],
})
export class LayoutModule {}
