import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

const mockTransaction: Transaction = {
  id: 1,
  amount: 150.75,
  senderId: 101,
  receiverId: 102,
  createdAt: new Date('2025-01-01T10:00:00Z'),
};

describe('TransactionController', () => {
  let transactionController: TransactionController;
  let transactionService: TransactionService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        JwtService,
        {
          provide: TransactionService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    transactionController = app.get<TransactionController>(
      TransactionController,
    );
    transactionService = app.get<TransactionService>(TransactionService);
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(transactionController).toBeDefined();
      expect(transactionService).toBeDefined();
    });
  });

  describe('createTransfer', () => {
    it('should create a transaction successfully', async () => {
      // Arrange
      const createTransactionDto: CreateTransactionDto = {
        amount: 100,
        receiverId: 1,
        senderId: 2,
      };

      jest
        .spyOn(transactionService, 'create')
        .mockResolvedValueOnce(mockTransaction);

      // Act
      const result =
        await transactionController.createTransfer(createTransactionDto);

      // Assert
      expect(transactionService.create).toHaveBeenCalledTimes(1);
      expect(transactionService.create).toHaveBeenCalledWith(
        createTransactionDto,
      );
      expect(result).toEqual(mockTransaction);
    });

    it('should throws an exception', async () => {
      // Arrange
      const createTransactionDto: CreateTransactionDto = {
        amount: 100,
        receiverId: 1,
        senderId: 2,
      };

      jest
        .spyOn(transactionService, 'create')
        .mockRejectedValueOnce(new Error());

      // Act & Assert
      await expect(
        transactionController.createTransfer(createTransactionDto),
      ).rejects.toThrow(Error);
    });
  });
});
