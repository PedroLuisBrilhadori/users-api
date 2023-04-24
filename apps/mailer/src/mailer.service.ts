import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);

  sendEmail(data: any) {
    this.logger.log('email sent', data);
  }
}
