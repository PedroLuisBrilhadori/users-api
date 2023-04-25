import { ClientProxy } from '@nestjs/microservices';
import { AvatarRepository } from '../repositories/avatar.repository';
import { UsersRepository } from '../repositories/users.repository';
import { UsersService } from '../users.service';
import { Test } from '@nestjs/testing';
import { MockRepository, MockSession } from '@app/common';
import { User } from '../schemas/user.schema';
import { Avatar } from '../schemas/avatar.schema';
import { MAILER_SERVICE } from '../constants/service';
import { Types } from 'mongoose';
import { HttpException } from '@nestjs/common';
import { of } from 'rxjs';

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

  beforeEach(() => {
    jest.clearAllMocks();
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

      jest
        .spyOn(userRepository, 'startTransaction')
        .mockImplementation(async () => new MockSession());

      expect(
        async () => await service.createUser(createDto),
      ).rejects.toThrowError(HttpException);
    });

    it('should create a user', async () => {
      const createDto = { name: 'pedro', email: 'pedro@example.co' };

      const result = {
        ...createDto,
        _id: new Types.ObjectId(),
        createdAt: new Date(),
      };

      jest
        .spyOn(userRepository, 'create')
        .mockImplementation(async () => result);

      jest
        .spyOn(userRepository, 'startTransaction')
        .mockImplementation(async () => new MockSession());

      jest.spyOn(mailerClient, 'emit').mockImplementation(() => of({}));

      expect(await service.createUser(createDto));
    });
  });

  describe('getUser', () => {
    it('should get a user', async () => {
      const data = {
        _id: new Types.ObjectId(),
        name: 'pedro',
        email: 'pedro@example.co',
      };

      jest
        .spyOn(userRepository, 'findOne')
        .mockImplementation(async () => data);

      expect((await service.getUser(data._id.toString())).data.name).toBe(
        data.name,
      );
      expect((await service.getUser(data._id.toString())).data.email).toBe(
        data.email,
      );
    });
  });

  describe('getusers', () => {
    it('should return an array of users', async () => {
      const data: User[] = [
        {
          _id: new Types.ObjectId(),
          name: 'pedro',
          email: 'pedro@example.co',
        },
        {
          _id: new Types.ObjectId(),
          name: 'Robert',
          email: 'robert.example.co',
        },
      ];

      const result = {
        data: data,
        page: 1,
        per_page: 5,
        total: data.length,
        total_pages: Math.ceil(data.length / 5),
      };

      jest
        .spyOn(userRepository, 'countDocuments')
        .mockImplementation(async () => data.length);

      jest.spyOn(userRepository, 'find').mockImplementation(async () => data);

      expect((await service.getUsers(1, 5)).data.length).toBe(
        result.data.length,
      );
      expect((await service.getUsers(1, 5)).total).toBe(result.total);
      expect((await service.getUsers(1, 5)).total_pages).toBe(
        result.total_pages,
      );
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

    it('should return saved avatar', async () => {
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
        .spyOn(avatarRepository, 'findOne')
        .mockImplementation(async () => result);

      expect((await service.getAvatar('123', file)).data).toBe(result.base64);
    });
  });

  describe('deleteAvatar', () => {
    it('should delete an avatar', async () => {
      const result = {
        acknowledged: true,
        deletedCount: 1,
      };

      jest
        .spyOn(avatarRepository, 'deleteOne')
        .mockImplementation(async () => result);

      expect(await service.deleteAvatar('1234')).toBe(result);
    });
  });
});
