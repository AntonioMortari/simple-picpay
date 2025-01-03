import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from 'src/infra/repository/user.repository';
import { Helper } from 'src/utils/helper';
import { CreateUserDto } from './dto/create-user.dto';
import { Prisma, RoleTypes, User } from '@prisma/client';

import { ConflictException } from '@nestjs/common';

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

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let helper: Helper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            create: jest.fn(),
            getById: jest.fn(),
            getByEmail: jest.fn(),
            update: jest.fn(),
            getByDocument: jest.fn(),
          },
        },
        {
          provide: Helper,
          useValue: {
            generateHash: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
    helper = module.get<Helper>(Helper);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should create an user successfully', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        balance: 50,
        document: '55555555555',
        email: 'email@example.com',
        name: 'Jonh Boyne',
        password: '123admin',
        role: RoleTypes.COMMOM,
      };

      jest.spyOn(userRepository, 'getByDocument').mockResolvedValueOnce(null);
      jest.spyOn(userRepository, 'getByEmail').mockResolvedValueOnce(null);
      jest.spyOn(userRepository, 'create').mockResolvedValueOnce(mockUser);
      jest.spyOn(helper, 'generateHash').mockReturnValueOnce('hashedPassword');

      // Act
      const result = await userService.create(createUserDto);

      // Assert
      expect(userRepository.getByDocument).toHaveBeenCalledWith(
        createUserDto.document,
      );
      expect(userRepository.getByDocument).toHaveBeenCalledTimes(1);

      expect(userRepository.getByEmail).toHaveBeenCalledTimes(1);
      expect(userRepository.getByEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );

      expect(result).toEqual(mockUser);
    });

    it('should throw Confilct exception if email already exists', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        balance: 50,
        document: '55555555555',
        email: 'existingEmail@example.com',
        name: 'Jonh Boyne',
        password: '123admin',
        role: RoleTypes.COMMOM,
      };

      jest.spyOn(userRepository, 'getByEmail').mockResolvedValueOnce(mockUser);

      // Act & Assert
      await expect(userService.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw Conflict exception if document already exists', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        balance: 50,
        document: 'existsDocument',
        email: 'existingEmail@example.com',
        name: 'Jonh Boyne',
        password: '123admin',
        role: RoleTypes.COMMOM,
      };

      jest
        .spyOn(userRepository, 'getByDocument')
        .mockResolvedValueOnce(mockUser);

      // Act & Assert
      await expect(userService.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('update', () => {
    it('should update an user successfully', async () => {
      // Arrange
      const updateUserDto: Prisma.UserUpdateInput = {
        email: 'updatedEmail@example.com',
      };

      const userId = 1;

      // Act
      const result = await userService.update(userId, updateUserDto);

      // Assert
      expect(userRepository.update).toHaveBeenCalledTimes(1);
      expect(userRepository.update).toHaveBeenCalledWith(userId, updateUserDto);

      expect(result).toBeUndefined();
    });

    it('should throws an exception', async () => {
      // Arrange
      const updateUserDto: Prisma.UserUpdateInput = {
        email: 'updatedEmail@example.com',
      };

      const userId = 1;

      jest.spyOn(userRepository, 'update').mockRejectedValue(new Error());

      // Act & Assert
      await expect(userService.update(userId, updateUserDto)).rejects.toThrow(
        Error,
      );
    });
  });

  describe('getByEmail', () => {
    it('should return an user successfully', async () => {
      // Arrange
      const email = 'email@example.com';

      jest.spyOn(userRepository, 'getByEmail').mockResolvedValue(mockUser);

      // Act
      const result = await userService.getByEmail(email);

      // Assert
      expect(userRepository.getByEmail).toHaveBeenCalledWith(email);
      expect(userRepository.getByEmail).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUser);
    });

    it('should throws an exception', async () => {
      // Arrange
      const email = 'email@example.com';

      jest.spyOn(userRepository, 'getByEmail').mockRejectedValue(new Error());

      // Act & Assert
      await expect(userService.getByEmail(email)).rejects.toThrow(Error);
    });
  });

  describe('getById', () => {
    it('should return an user successfully', async () => {
      // Arrange
      const userId = 1;

      jest.spyOn(userRepository, 'getById').mockResolvedValue(mockUser);

      // Act
      const result = await userService.getById(userId);

      // Assert
      expect(userRepository.getById).toHaveBeenCalledTimes(1);
      expect(userRepository.getById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUser);
    });

    it('should throws an exception', async () => {
      // Arrange
      const userId = 1;

      jest.spyOn(userRepository, 'getById').mockRejectedValueOnce(new Error());

      // Act & Assert
      await expect(userService.getById(userId)).rejects.toThrow(Error);
    });
  });
});
