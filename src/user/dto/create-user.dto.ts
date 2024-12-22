import { RoleTypes } from '@prisma/client';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  document: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  role?: RoleTypes;

  @IsNumber()
  balance: number;
}
