import { Test } from '@nestjs/testing';
import { MockRepository } from '@app/common';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { Types } from 'mongoose';
import { User } from '../schemas/user.schema';
import { Avatar } from '../schemas/avatar.schema';
import { UsersRepository } from '../repositories/users.repository';
import { AvatarRepository } from '../repositories/avatar.repository';
import { MAILER_SERVICE } from '../constants/service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
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

    controller = moduleRef.get<UsersController>(UsersController);
    service = moduleRef.get<UsersService>(UsersService);
  });

  describe('findAll', () => {
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

      jest.spyOn(service, 'getUsers').mockImplementation(async () => result);

      expect(await controller.getUsers(1, 5)).toBe(result);
    });

    it('should return query params default', async () => {
      const data = [
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
        per_page: 10,
        total: data.length,
        total_pages: Math.ceil(data.length / 5),
      };

      jest.spyOn(service, 'getUsers').mockImplementation(async () => result);

      expect(await controller.getUsers()).toBe(result);
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createDto = { name: 'pedro', email: 'pedro@example.co' };

      const result = {
        ...createDto,
        _id: new Types.ObjectId(),
        createdAt: new Date(),
      };

      jest.spyOn(service, 'createUser').mockImplementation(async () => result);

      expect(await controller.createUser(createDto)).toBe(result);
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      const userId = new Types.ObjectId();

      const result = {
        data: {
          _id: userId,
          name: 'Pedro',
          email: 'pedro@example.co',
        },
      };

      jest.spyOn(service, 'getUser').mockImplementation(async () => result);

      expect(await controller.getUser({ userId })).toBe(result);
    });
  });

  describe('getAvatar', () => {
    it('should create an avatar', async () => {
      const userId = '123';

      const result = {
        data: 'image',
      };

      jest.spyOn(service, 'getAvatar').mockImplementation(async () => result);

      expect(await controller.getAvatar({ userId }, {})).toBe(result);
    });
  });

  describe('deleteAvatar', () => {
    it('should delete an avatar', async () => {
      const userId = '123';

      const result = {
        acknowledged: true,
        deletedCount: 1,
      };

      jest
        .spyOn(service, 'deleteAvatar')
        .mockImplementation(async () => result);

      expect(await controller.deleteAvatar({ userId })).toBe(result);
    });
  });
});
