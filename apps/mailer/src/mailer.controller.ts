import { Controller, Get } from '@nestjs/common';
import { MailerService } from './mailer.service';

@Controller()
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Get()
  sendEmail(): string {
    return this.mailerService.sendEmail('email');
  }
}
