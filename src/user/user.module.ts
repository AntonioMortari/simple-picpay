import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from 'src/infra/repository/user.repository';

@Module({
  providers: [UserService, UserRepository],
  imports: [],
})
export class UserModule {}
