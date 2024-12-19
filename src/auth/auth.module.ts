import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/infra/repository/user.repository';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { Helper } from 'src/utils/helper';

@Module({
  providers: [AuthService, UserService, UserRepository, JwtService, Helper],
  controllers: [AuthController],
})
export class AuthModule {}
