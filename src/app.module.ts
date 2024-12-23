import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TransactionModule } from './transaction/transaction.module';
import { MessagingService } from './services/messaging/messaging.service';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, AuthModule, TransactionModule],
  controllers: [AppController],
  providers: [AppService, MessagingService],
})
export class AppModule {}
