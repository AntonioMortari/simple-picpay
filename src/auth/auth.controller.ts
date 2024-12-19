import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginRequestDto) {
    const result = await this.authService.login(dto);

    return result;
  }

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    const result = await this.authService.register(dto);

    return result;
  }
}
