import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../../auth/auth.controller';
import { AuthService } from '../../../auth/auth.service';
import { LoginRequestDto } from '../../../auth/dto/login-request.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { RoleTypes } from '@prisma/client';

const mockAuthResponse = {
  token: 'token',
  user: 1,
};

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue(mockAuthResponse),
            register: jest.fn().mockResolvedValue(mockAuthResponse),
          },
        },
      ],
    }).compile();

    authController = app.get<AuthController>(AuthController);
    authService = app.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should login successfully', async () => {
      // Arrange
      const loginDto: LoginRequestDto = {
        email: 'email@example.com',
        password: '123admin',
      };

      // Act
      const result = await authController.login(loginDto);

      // Assert
      expect(authService.login).toHaveBeenCalledTimes(1);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(mockAuthResponse);
    });

    it('should throw an exception', async () => {
      // Arrange
      const loginDto: LoginRequestDto = {
        email: 'wrongEmail@example.com',
        password: '123admin',
      };

      // Act & Assert
      jest.spyOn(authService, 'login').mockRejectedValueOnce(new Error());
      await expect(authController.login(loginDto)).rejects.toThrow(Error);
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

      // Act
      const result = await authController.register(registerDto);

      // Assert
      expect(authService.register).toHaveBeenCalledTimes(1);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockAuthResponse);
    });

    it('should throws an exception', async () => {
      // Arrange
      const registerDto: CreateUserDto = {
        balance: 50,
        document: 'wrongDocument',
        email: 'wrongEmail@example.com',
        name: 'Jonh Boyne',
        password: '123',
        role: RoleTypes.COMMOM,
      };

      // Act & Assert
      jest.spyOn(authService, 'register').mockRejectedValueOnce(new Error());
      await expect(authController.register(registerDto)).rejects.toThrow(Error);
    });
  });
});
