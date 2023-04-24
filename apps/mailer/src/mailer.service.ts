import { Injectable } from '@nestjs/common';

@Injectable()
export class MailerService {
  sendEmail(email: string): string {
    return 'email sent';
  }
}
