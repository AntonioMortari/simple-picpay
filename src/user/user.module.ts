import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from 'src/infra/repository/user.repository';
import { Helper } from 'src/utils/helper';

@Module({
  providers: [UserService, UserRepository, Helper],
  imports: [],
})
export class UserModule {}
