import { IsNumber } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  amount: number;

  @IsNumber()
  senderId: number;

  @IsNumber()
  receiverId: number;
}
