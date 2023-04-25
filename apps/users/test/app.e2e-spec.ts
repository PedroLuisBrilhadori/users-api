import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from './../src/users.module';
import { CreateUserDto } from '../src/dto/create-user.dto';
import { Types } from 'mongoose';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const userDto: CreateUserDto = {
  name: 'pedro',
  email: 'pedro@example.co',
};

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let userId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  describe('POST /api/users', () => {
    it('should create a user', async () => {
      const { statusCode, body } = await request(app.getHttpServer())
        .post('/api/users')
        .send(userDto);

      expect(statusCode).toBe(201);
      expect(body.name).toBe(userDto.name);
      expect(body._id).toBeDefined();

      userId = body._id;
    });

    it('should throw an error when post without body', async () => {
      const errors = [
        'name should not be empty',
        'name must be a string',
        'email must be an email',
        'email should not be empty',
        'email must be a string',
      ];

      const { statusCode, body } = await request(app.getHttpServer())
        .post('/api/users')
        .send({});

      expect(statusCode).toBe(400);
      expect(body.message).toEqual(errors);
    });
  });

  describe('GET /api/users/:userId', () => {
    it('should get a user', async () => {
      const { statusCode, body } = await request(app.getHttpServer()).get(
        `/api/users/${userId}`,
      );

      expect(statusCode).toBe(200);
      expect(body.data.name).toBe(userDto.name);
      expect(body.data._id).toBeDefined();
    });

    it('should throw an erro not found user', async () => {
      const { statusCode, body } = await request(app.getHttpServer()).get(
        `/api/users/${new Types.ObjectId()}`,
      );

      expect(statusCode).toBe(404);
      expect(body.message).toBe('Document not found.');
    });

    it('should throw an error not found user', async () => {
      const { statusCode, body } = await request(app.getHttpServer()).get(
        `/api/users/${new Types.ObjectId()}`,
      );

      expect(statusCode).toBe(404);
      expect(body.message).toBe('Document not found.');
    });

    it('should throw an error when bad request', async () => {
      const { statusCode, body } = await request(app.getHttpServer()).get(
        `/api/users/${123}`,
      );

      expect(statusCode).toBe(500);
      expect(body.message).toBe('Please wait a few minutes before try again.');
    });
  });

  describe('GET /api/users', () => {
    it('should get users', async () => {
      const { statusCode, body } = await request(app.getHttpServer()).get(
        '/api/users',
      );

      expect(statusCode).toBe(200);
      expect(body.page).toBe(1);
      expect(body.per_page).toBe(10);
    });

    it('should get users with query params', async () => {
      const { statusCode, body } = await request(app.getHttpServer()).get(
        '/api/users/?page=2&limit=5',
      );

      expect(statusCode).toBe(200);
      expect(body.page).toBe('2');
      expect(body.per_page).toBe('5');
    });
  });

  describe('GET & DELETE api/userId/avatar', () => {
    it('should set avatar on first request', async () => {
      const imageFilePath = resolve(__dirname, './uploads/cat.png');
      const imageBuffer = readFileSync(imageFilePath);

      const { statusCode, body } = await request(app.getHttpServer())
        .get(`/api/users/${userId}/avatar`)
        .set(`Content-Type`, `multipart/form-data`)
        .attach('image', imageBuffer, {
          filename: 'cat.png',
          contentType: 'image/png',
        });

      const result = body.data === imageBuffer.toString('base64');

      expect(statusCode).toBe(200);
      expect(result).toBeTruthy();
    });

    it('should delete a avatar', async () => {
      const { statusCode, body } = await request(app.getHttpServer()).delete(
        `/api/users/${userId}/avatar`,
      );

      expect(statusCode).toBe(200);
      expect(body.deletedCount).toBe(1);
    });

    it('should throw an error when the image is not a png ', async () => {
      const imageFilePath = resolve(__dirname, './uploads/cat.jpg');
      const imageBuffer = readFileSync(imageFilePath);

      const { statusCode, body } = await request(app.getHttpServer())
        .get(`/api/users/${userId}/avatar`)
        .set(`Content-Type`, `multipart/form-data`)
        .attach('image', imageBuffer, {
          filename: 'cat.jpg',
          contentType: 'image/jpg',
        });

      expect(statusCode).toBe(400);
      expect(body.message).toBe('Image not uploaded');
    });

    it('should throw an error without avatar image', async () => {
      const { statusCode, body } = await request(app.getHttpServer()).get(
        `/api/users/${userId}/avatar`,
      );

      expect(statusCode).toBe(400);
      expect(body.message).toBe('Image not uploaded');
    });
  });
});
