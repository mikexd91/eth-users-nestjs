import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './users.entity'
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ TypeOrmModule.forFeature([User]), ConfigModule],
  providers: [UsersService, ConfigService],
  controllers: [UsersController]
})
export class UsersModule {}
