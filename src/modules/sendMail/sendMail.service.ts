import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailDto } from './dto/sendEmail.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SendMailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  private readonly logger = new Logger(SendMailService.name);

  async sendBTConEmail(sendEmailDto: SendEmailDto) {
    try {
      const { recipients, subject, text } = sendEmailDto;

      // TODO: Можно сделать чтобы отправители разные были, но по ТЗ нет такого условия.
      // const sender: string | Address = sendEmailDto.sender ?? {
      //   name: this.configService.get('MAIL_FROM_NAME'),
      //   address: this.configService.get('MAIL_USERNAME'),
      // };

      const message = await this.mailerService.sendMail({
        // from: sender,
        to: recipients,
        subject,
        text,
      });
      this.logger.log(`Письмо отправлено на почту `);
      return message;
    } catch (error) {
      this.logger.error('Письмо не отправлено', error);
    }
  }
}
