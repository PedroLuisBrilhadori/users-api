import { Email } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);

  sendEmail(data: Email) {
    this.logger.log('email sent', data);
  }
}
