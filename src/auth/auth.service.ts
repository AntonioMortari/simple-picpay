import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Helper } from 'src/utils/helper';
import { jwtConstants } from 'src/config/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly helper: Helper,
  ) {}

  async login(dto: LoginRequestDto) {
    const user = await this.userService.getByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Email or password incorrect');
    }

    if (!this.helper.compareHash(dto.password, user.password)) {
      throw new UnauthorizedException('Email or password incorrect');
    }

    const token = this.jwtService.sign(
      {
        role: user.role,
        id: user.id,
        email: user.email,
      },
      { expiresIn: jwtConstants.expiresIn, secret: jwtConstants.secret },
    );

    return {
      token,
      user: user.id,
    };
  }

  async register(dto: CreateUserDto) {
    const user = await this.userService.create(dto);

    if (!user) {
      throw new Error('Error creating user');
    }

    const token = this.jwtService.sign(
      {
        role: user.role,
        id: user.id,
        email: user.email,
      },
      { expiresIn: jwtConstants.expiresIn, secret: jwtConstants.secret },
    );

    return {
      token,
      user: user.id,
    };
  }
}
