import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from './../src/users.module';
import { CreateUserDto } from '../src/dto/create-user.dto';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('POST /api/users', () => {
    it('/api/users (POST)', async () => {
      const userDto: CreateUserDto = {
        name: 'pedro',
        email: 'pedro@example.co',
      };

      const { statusCode, body, ...res } = await request(app.getHttpServer())
        .post('/api/users')
        .send(userDto);

      console.log(statusCode);
      console.log(body);

      expect(statusCode).toBe(200);
      expect(body.name).toBe(userDto.name);
    });
  });
});
