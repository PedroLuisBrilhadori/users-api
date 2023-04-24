import { Controller, Get } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Email, RmqService } from '@app/common';

@Controller()
export class MailerController {
  constructor(
    private readonly mailerService: MailerService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('user_created')
  sendEmail(@Payload() data: Email, @Ctx() context: RmqContext) {
    this.mailerService.sendEmail(data);
  }
}
