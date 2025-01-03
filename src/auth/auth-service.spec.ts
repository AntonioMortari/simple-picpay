import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { Helper } from 'src/utils/helper';
import { JwtService } from '@nestjs/jwt';
import { LoginRequestDto } from './dto/login-request.dto';
import { RoleTypes, User } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from 'src/config/constants';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

export const mockUser: User = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  document: '12345678901',
  password: 'hashedpassword',
  role: 'COMMOM',
  balance: 1000.0,
  createdAt: new Date(),
};

const mockAuthResponse = {
  token: 'token',
  user: 1,
};

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let helper: Helper;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            getByEmail: jest.fn(),
          },
        },
        {
          provide: Helper,
          useValue: {
            compareHash: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    helper = module.get<Helper>(Helper);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should return a token and user id successfully', async () => {
      // Arrange
      const loginDto: LoginRequestDto = {
        email: 'john.doe@example.com',
        password: 'hashedpassword',
      };

      jest.spyOn(userService, 'getByEmail').mockResolvedValueOnce(mockUser);
      jest.spyOn(helper, 'compareHash').mockReturnValueOnce(true);
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce('token');

      // Act
      const result = await authService.login(loginDto);

      // Assert
      expect(userService.getByEmail).toHaveBeenCalledTimes(1);
      expect(userService.getByEmail).toHaveBeenCalledWith(loginDto.email);

      expect(helper.compareHash).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
      expect(helper.compareHash).toHaveBeenCalledTimes(1);

      expect(jwtService.sign).toHaveBeenCalledTimes(1);

      expect(result).toEqual({ token: 'token', user: mockUser.id });
    });

    it('should generate a JWT with correct payload', async () => {
      // Arrange
      const loginDto: LoginRequestDto = {
        email: 'john.doe@example.com',
        password: 'hashedpassword',
      };

      const mockToken = 'token';
      jest.spyOn(userService, 'getByEmail').mockResolvedValueOnce(mockUser);
      jest.spyOn(helper, 'compareHash').mockReturnValueOnce(true);
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce(mockToken);

      // Act
      await authService.login(loginDto);

      // Assert
      expect(jwtService.sign).toHaveBeenCalledWith(
        {
          role: mockUser.role,
          id: mockUser.id,
          email: mockUser.email,
        },
        { expiresIn: jwtConstants.expiresIn, secret: jwtConstants.secret },
      );
    });

    it('should throw Unauthorized exception if user not found', async () => {
      // Arrange
      const loginDto: LoginRequestDto = {
        email: 'wrongEmail@example.com',
        password: 'hashedpassword',
      };

      jest.spyOn(userService, 'getByEmail').mockResolvedValueOnce(null);

      // Act & Assert
      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw Unauthorized if password incorrect', async () => {
      // Arrange
      const loginDto: LoginRequestDto = {
        email: 'john.doe@example.com',
        password: 'wrongPassword',
      };

      jest.spyOn(userService, 'getByEmail').mockResolvedValueOnce(mockUser);
      jest.spyOn(helper, 'compareHash').mockReturnValueOnce(false);

      // Act & Assert
      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('register', () => {
    it('should register an user successfully', async () => {
      // Arrange
      const registerDto: CreateUserDto = {
        balance: 50,
        document: '55555555555',
        email: 'email@example.com',
        name: 'Jonh Boyne',
        password: '123admin',
        role: RoleTypes.COMMOM,
      };

      const mockToken = 'token';

      jest.spyOn(userService, 'create').mockResolvedValueOnce(mockUser);
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce(mockToken);

      // Act
      const result = await authService.register(registerDto);

      // Assert
      expect(userService.create).toHaveBeenCalledTimes(1);
      expect(userService.create).toHaveBeenCalledWith(registerDto);

      expect(jwtService.sign).toHaveBeenCalledTimes(1);

      expect(result).toEqual(mockAuthResponse);
    });

    it('should generate a JWT with correct payload', async () => {
      // Arrange
      const registerDto: CreateUserDto = {
        balance: 50,
        document: '55555555555',
        email: 'email@example.com',
        name: 'Jonh Boyne',
        password: '123admin',
        role: RoleTypes.COMMOM,
      };

      const mockToken = 'token';

      jest.spyOn(userService, 'create').mockResolvedValueOnce(mockUser);
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce(mockToken);

      // Act
      await authService.register(registerDto);

      // Assert
      expect(jwtService.sign).toHaveBeenCalledWith(
        {
          role: mockUser.role,
          id: mockUser.id,
          email: mockUser.email,
        },
        { expiresIn: jwtConstants.expiresIn, secret: jwtConstants.secret },
      );
    });

    it('should throws an exception', async () => {
      // Arrange
      const registerDto: CreateUserDto = {
        balance: 50,
        document: '55555555555',
        email: 'worngEmail@example.com',
        name: 'Jonh Boyne',
        password: 'wrong',
        role: RoleTypes.COMMOM,
      };

      jest.spyOn(userService, 'create').mockRejectedValue(new Error());

      // Act & Assert
      await expect(authService.register(registerDto)).rejects.toThrow(Error);
    });
  });
});
