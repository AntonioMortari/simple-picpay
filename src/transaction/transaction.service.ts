import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionRepository } from 'src/infra/repository/transaction.repository';
import { UserService } from 'src/user/user.service';
import { User } from '@prisma/client';
import { MessagingService } from 'src/services/messaging/messaging.service';
import { templateEmails } from 'src/templates/email';

@Injectable()
export class TransactionService {
  constructor(
    private readonly tranactionRepository: TransactionRepository,
    private readonly userService: UserService,
    private readonly messagingService: MessagingService,
  ) {}

  async create(dto: CreateTransactionDto) {
    const { receiverId, senderId, amount } = dto;

    const receiver = await this.userService.getById(receiverId);
    const sender = await this.userService.getById(senderId);

    if (!receiver) {
      throw new NotFoundException('Receiver not found');
    }

    if (!sender) {
      throw new NotFoundException('Sender not found');
    }

    await this.validateSenderBalance(sender, amount);

    await this.validateTransaction();

    await this.userService.update(senderId, {
      balance: sender.balance - amount,
    });

    await this.userService.update(receiverId, {
      balance: receiver.balance + amount,
    });

    const transaction = await this.tranactionRepository.create(dto);

    await this.messagingService.sendMessage({
      html: templateEmails.transferSuccessfully(sender, receiver, amount),
      subject: 'Transferência realizada com sucesso!',
      to: receiver.email,
    });

    return transaction;
  }

  private async validateTransaction() {
    const response = await fetch('https://util.devi.tools/api/v2/authorize');

    if (response.status !== HttpStatus.OK) {
      throw new ForbiddenException('Transaction authorization failed');
    }
  }

  private async validateSenderBalance(sender: User, amount: number) {
    if (sender.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }
  }
}
