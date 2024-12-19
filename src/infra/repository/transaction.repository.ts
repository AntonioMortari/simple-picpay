import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from 'src/transaction/dto/create-transaction.dto';
import { prisma } from '../database/prisma-instance';

@Injectable()
export class TransactionRepository {
  async create(transaction: CreateTransactionDto) {
    return await prisma.transaction.create({
      data: {
        ...transaction,
      },
    });
  }
}
