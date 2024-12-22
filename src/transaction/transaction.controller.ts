import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/utils/roles.decorator';
import { RoleTypes } from '@prisma/client';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('transfer')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles([RoleTypes.COMMOM])
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTransfer(@Body() dto: CreateTransactionDto) {
    const transaction = await this.transactionService.create(dto);

    return transaction;
  }
}
