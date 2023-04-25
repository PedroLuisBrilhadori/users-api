import { Controller, Get } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Email } from '@app/common';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Get('health')
  getHealhy() {
    return 0;
  }

  @EventPattern('user_created')
  async sendEmail(@Payload() data: Email) {
    return this.mailerService.sendEmail(data);
  }
}
