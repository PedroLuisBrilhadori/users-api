import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './repositories/users.repository';
import { AvatarRepository } from './repositories/avatar.repository';
import { AvatarDto } from './dto/create-avatar.dto';
import { MAILER_SERVICE } from './constants/service';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(
    private userRepository: UsersRepository,
    private avatarRepository: AvatarRepository,
    @Inject(MAILER_SERVICE) private mailerClient: ClientProxy,
  ) {}

  async createUser(request: CreateUserDto) {
    const session = await this.userRepository.startTransaction();

    try {
      const user = await this.userRepository.create(request, { session });

      await lastValueFrom(
        this.mailerClient.emit('user_created', {
          request,
        }),
      );

      await session.commitTransaction();
      return { data: user };
    } catch (error) {
      await session.abortTransaction();
      throw new HttpException(
        'Please wait a few minutes before try again.',
        500,
      );
    }
  }

  async getUsers() {
    return this.userRepository.find({});
  }

  async getUser(userId: string) {
    return this.userRepository.findOne({
      _id: userId,
    });
  }

  async getAvatar(userId: string, file: any) {
    try {
      const { base64 } = await this.avatarRepository.findOne(
        {
          userId: userId,
        },
        false,
      );

      if (base64) return { data: base64 };
    } catch (error) {}

    if (!file) throw new HttpException('Image not uploaded', 400);

    const avatar: AvatarDto = {
      originalName: file.originalname,
      fileName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      base64: file.buffer.toString('base64'),
    };

    const { base64 } = await this.avatarRepository.create({
      userId,
      ...avatar,
    });

    return { data: base64 };
  }

  async deleteAvatar(userId: string) {
    return this.avatarRepository.deleteOne({ userId });
  }
}
