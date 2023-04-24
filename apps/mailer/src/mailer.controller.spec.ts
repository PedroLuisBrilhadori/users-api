import { Test, TestingModule } from '@nestjs/testing';
import { MailerController } from './mailer.controller';
import { MailerService } from './mailer.service';
import { Email } from '@app/common';

describe('MailerController', () => {
  let mailerController: MailerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MailerController],
      providers: [MailerService],
    }).compile();

    mailerController = app.get<MailerController>(MailerController);
  });

  describe('sendEmail', () => {
    it('should send a email when user created', async () => {
      const email: Email = {
        title: 'test email',
        content: 'this is a test email.',
        name: 'pedro',
        email: 'pedro@example.co',
      };

      expect(await mailerController.sendEmail(email)).toBe('email sent');
    });
  });
});
