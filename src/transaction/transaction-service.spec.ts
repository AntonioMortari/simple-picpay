import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from 'src/infra/repository/transaction.repository';
import { UserService } from 'src/user/user.service';
import { MessagingService } from 'src/services/messaging/messaging.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import {
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { RoleTypes, User } from '@prisma/client';

describe('TransactionService', () => {
  let transactionService: TransactionService;
  let transactioRepository: TransactionRepository;
  let userService: UserService;
  let messagingService: MessagingService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: TransactionRepository,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            getById: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: MessagingService,
          useValue: {
            sendMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    transactionService = app.get<TransactionService>(TransactionService);
    transactioRepository = app.get<TransactionRepository>(
      TransactionRepository,
    );
    userService = app.get<UserService>(UserService);
    messagingService = app.get<MessagingService>(MessagingService);
  });

  describe('create', () => {
    const createTransactionDto: CreateTransactionDto = {
      amount: 100,
      receiverId: 1,
      senderId: 2,
    };

    const sender: User = {
      id: 2,
      balance: 500,
      email: 'sender@test.com',
      name: 'Sender',
      createdAt: new Date(),
      document: '12345678900',
      password: '123admin',
      role: RoleTypes.COMMOM,
    };
    const receiver: User = {
      id: 1,
      balance: 300,
      email: 'receiver@test.com',
      name: 'Receiver',
      document: '12345678900',
      createdAt: new Date(),
      password: '123admin',
      role: RoleTypes.COMMOM,
    };

    it('should create a transaction successfully', async () => {
      // Arrange
      jest.spyOn(userService, 'getById').mockResolvedValueOnce(receiver);
      jest.spyOn(userService, 'getById').mockResolvedValueOnce(sender);
      jest.spyOn(userService, 'update').mockResolvedValue(null);
      jest.spyOn(transactioRepository, 'create').mockResolvedValue({
        id: 1,
        ...createTransactionDto,
        createdAt: new Date(),
        senderId: sender.id,
        receiverId: receiver.id,
      });
      jest.spyOn(messagingService, 'sendMessage').mockResolvedValue(null);

      jest.spyOn(global, 'fetch').mockResolvedValue({
        status: 200,
        json: jest.fn(),
      } as unknown as Response);

      // Act
      const result = await transactionService.create(createTransactionDto);

      // Assert
      expect(userService.getById).toHaveBeenCalledWith(1);
      expect(userService.getById).toHaveBeenCalledWith(2);
      expect(userService.update).toHaveBeenCalledTimes(2);
      expect(transactioRepository.create).toHaveBeenCalledWith(
        createTransactionDto,
      );
      expect(messagingService.sendMessage).toHaveBeenCalled();
      expect(result).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          amount: createTransactionDto.amount,
          senderId: sender.id,
          receiverId: receiver.id,
        }),
      );
    });

    it('should throw NotFoundException if receiver is not found', async () => {
      // Arrange
      jest.spyOn(userService, 'getById').mockResolvedValueOnce(null);

      // Act & Assert
      await expect(
        transactionService.create(createTransactionDto),
      ).rejects.toThrow(NotFoundException);
      expect(userService.getById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if sender is not found', async () => {
      // Arrange
      jest.spyOn(userService, 'getById').mockResolvedValueOnce(receiver);
      jest.spyOn(userService, 'getById').mockResolvedValueOnce(null);

      // Act & Assert
      await expect(
        transactionService.create(createTransactionDto),
      ).rejects.toThrow(NotFoundException);
      expect(userService.getById).toHaveBeenCalledWith(2);
    });

    it('should throw BadRequestException if sender has insufficient balance', async () => {
      // Arrange
      jest.spyOn(userService, 'getById').mockResolvedValueOnce(receiver);
      jest
        .spyOn(userService, 'getById')
        .mockResolvedValueOnce({ ...sender, balance: 50 });

      // Act & Assert
      await expect(
        transactionService.create(createTransactionDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ForbiddenException if transaction authorization fails', async () => {
      // Arrange
      jest.spyOn(userService, 'getById').mockResolvedValueOnce(receiver);
      jest.spyOn(userService, 'getById').mockResolvedValueOnce(sender);

      jest.spyOn(global, 'fetch').mockResolvedValue({
        status: 403,
        json: jest.fn(),
      } as unknown as Response);

      // Act & Assert
      await expect(
        transactionService.create(createTransactionDto),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
