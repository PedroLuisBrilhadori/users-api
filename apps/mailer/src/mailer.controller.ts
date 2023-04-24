import { Controller, Get } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Controller()
export class MailerController {
  constructor(
    private readonly mailerService: MailerService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('user_created')
  sendEmail(@Payload() data: any, @Ctx() context: RmqContext) {
    this.mailerService.sendEmail(data);
  }
}
