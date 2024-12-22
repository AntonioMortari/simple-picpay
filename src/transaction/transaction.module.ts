import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from 'src/infra/repository/transaction.repository';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/infra/repository/user.repository';
import { Helper } from 'src/utils/helper';

@Module({
  providers: [
    TransactionService,
    TransactionRepository,
    UserService,
    UserRepository,
    Helper,
  ],
})
export class TransactionModule {}
