import { Controller } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Email } from '@app/common';

@Controller()
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @EventPattern('user_created')
  async sendEmail(@Payload() data: Email) {
    return this.mailerService.sendEmail(data);
  }
}
