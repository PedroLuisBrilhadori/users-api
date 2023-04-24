import { ClientProxy } from '@nestjs/microservices';
import { AvatarRepository } from './repositories/avatar.repository';
import { UsersRepository } from './repositories/users.repository';
import { UsersService } from './users.service';
import { Test } from '@nestjs/testing';
import { MockRepository } from '@app/common';
import { User } from './schemas/user.schema';
import { Avatar } from './schemas/avatar.schema';
import { MAILER_SERVICE } from './constants/service';
import { Types } from 'mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Type } from 'class-transformer';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: UsersRepository;
  let avatarRepository: AvatarRepository;
  let mailerClient: ClientProxy;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useClass: MockRepository<User>,
        },
        {
          provide: AvatarRepository,
          useClass: MockRepository<Avatar>,
        },
        {
          provide: MAILER_SERVICE,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get<UsersService>(UsersService);
    userRepository = moduleRef.get<UsersRepository>(UsersRepository);
    avatarRepository = moduleRef.get<AvatarRepository>(AvatarRepository);
    mailerClient = moduleRef.get<ClientProxy>(MAILER_SERVICE);
  });

  describe('create', () => {
    it('should throw a error when creating a user', async () => {
      const createDto = { name: 'pedro', email: 'pedro@example.co' };

      const result = {
        ...createDto,
        _id: new Types.ObjectId(),
        createdAt: new Date(),
      };

      jest
        .spyOn(userRepository, 'create')
        .mockImplementation(async () => result);

      expect(
        async () => await service.createUser(createDto),
      ).rejects.toThrowError(HttpException);
    });
  });

  describe('getAvatar', () => {
    it('should throw a erro when creating avatar without file', async () => {
      const file = {};

      expect(
        async () => await service.getAvatar('123', file),
      ).rejects.toThrowError(HttpException);
    });

    it('should creating avatar', async () => {
      const file = {
        originalname: 'photo',
        mimetype: 'image/png',
        size: 200,
        buffer: Buffer.from('test'),
      };

      const result: Avatar = {
        _id: new Types.ObjectId(),
        userId: '123',
        fileName: file.originalname,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        base64: file.buffer.toString('base64'),
      };

      jest
        .spyOn(avatarRepository, 'create')
        .mockImplementation(async () => result);

      expect((await service.getAvatar('123', file)).data).toBe(result.base64);
    });
  });
});
