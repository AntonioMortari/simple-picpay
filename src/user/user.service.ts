import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/infra/repository/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { Helper } from 'src/utils/helper';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly helper: Helper,
  ) {}

  async create(dto: CreateUserDto) {
    await this.validateUserUnique(dto);

    return await this.userRepository.create({
      ...dto,
      password: this.helper.generateHash(dto.password),
    });
  }

  async update(id: number, dto: Prisma.UserUpdateInput) {
    await this.userRepository.update(id, dto);
  }

  async getByEmail(email: string) {
    return await this.userRepository.getByEmail(email);
  }

  async getById(id: number) {
    return await this.userRepository.getById(id);
  }

  private async validateUserUnique(dto: CreateUserDto) {
    const { email, document } = dto;

    const findEmail = await this.userRepository.getByEmail(email);

    if (findEmail) {
      throw new BadRequestException(`User with email ${email} exists`);
    }

    const findDocument = await this.userRepository.getByDocument(document);

    if (findDocument) {
      throw new BadRequestException(`User with document ${document} exists`);
    }
  }
}
