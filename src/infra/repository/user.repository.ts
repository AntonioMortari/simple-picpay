import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { prisma } from '../database/prisma-instance';
import { User } from '@prisma/client';

@Injectable()
export class UserRepository {
  async create(user: CreateUserDto): Promise<User> {
    return await prisma.user.create({
      data: {
        ...user,
      },
    });
  }

  async getById(id: number): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async getByDocument(document: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        document,
      },
    });
  }

  async getByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
