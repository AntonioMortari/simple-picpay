import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/infra/repository/user.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(dto: CreateUserDto) {
    await this.validateUserUnique(dto);

    return await this.userRepository.create(dto);
  }

  async getByEmail(email: string) {
    return await this.userRepository.getByEmail(email);
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
