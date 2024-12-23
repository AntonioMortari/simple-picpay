import { Injectable, Logger } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { SendMessageDto } from './dto/send-message.dto';
import { messageConstants } from 'src/config/constants';

@Injectable()
export class MessagingService {
  private transporter: Transporter;
  private logger: Logger;

  constructor() {
    this.logger = new Logger(MessagingService.name);
    this.transporter = createTransport({
      port: parseInt(messageConstants.host || '587', 10),
      host: messageConstants.host,
      auth: {
        user: messageConstants.auth.user,
        pass: messageConstants.auth.pass,
      },
    });
  }

  public async sendMessage(params: SendMessageDto) {
    try {
      if (!params.from) {
        params.from = messageConstants.from;
      }

      const result = await this.transporter.sendMail(params);
      this.logger.log(
        `Example mail sent to ${
          params.to
        } successfully. Result: ${JSON.stringify(result)}`,
      );
    } catch (err) {
      this.logger.error(`Error to send email: ${err}`);
    }
  }
}
