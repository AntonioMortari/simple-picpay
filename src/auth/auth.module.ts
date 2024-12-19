import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/infra/repository/user.repository';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthService, UserService, UserRepository, JwtService],
  controllers: [AuthController],
})
export class AuthModule {}
