import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './repositories/users.repository';
import { AvatarRepository } from './repositories/avatar.repository';
import { AvatarDto } from './dto/create-avatar.dto';
import { MAILER_SERVICE } from './constants/service';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { User } from './schemas/user.schema';
import { Email } from '@app/common';

@Injectable()
export class UsersService {
  constructor(
    private userRepository: UsersRepository,
    private avatarRepository: AvatarRepository,
    @Inject(MAILER_SERVICE) private mailerClient: ClientProxy,
  ) {}

  private readonly logger = new Logger(UsersService.name);

  async createUser(request: CreateUserDto) {
    const session = await this.userRepository.startTransaction();

    try {
      const user = (await this.userRepository.create(request, {
        session,
      })) as User;

      const email: Email = {
        ...request,
        title: `Confirm your email`,
        content: `Hello ${request.name}! \nPlease, confirm your email!`,
      };

      await lastValueFrom(
        this.mailerClient.emit('user_created', {
          email,
        }),
      );

      await session.commitTransaction();
      return { ...user, createdAt: new Date() };
    } catch (error) {
      await session.abortTransaction();
      this.logger.warn('user not created', error);
      throw new HttpException(
        'Please wait a few minutes before try again.',
        500,
      );
    }
  }

  async getUsers(page: number, limit: number) {
    const total = await this.userRepository.countDocuments();
    const total_pages = Math.ceil(total / limit);
    const data = (await this.userRepository.find(
      {},
      {
        skip: (page - 1) / limit,
        limit: limit,
        select: 'id name email',
      },
    )) as User[];

    return {
      page,
      data,
      total,
      total_pages,
      per_page: limit,
    };
  }

  async getUser(userId: string) {
    const user = (await this.userRepository.findOne({
      _id: userId,
    })) as User;

    return {
      data: user,
    };
  }

  async getAvatar(userId: string, file: any): Promise<{ data: string }> {
    try {
      const { base64 } = await this.avatarRepository.findOne(
        {
          userId: userId,
        },
        false,
      );

      if (base64) return { data: base64 };
    } catch (error) {}

    if (
      !file ||
      typeof file.originalname !== 'string' ||
      file.mimetype !== 'image/png' ||
      file.size < 1 ||
      !file.buffer
    )
      throw new HttpException('Image not uploaded', 400);

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

    this.logger.log('Avatar created', avatar);

    return { data: base64 };
  }

  async deleteAvatar(userId: string) {
    return this.avatarRepository.deleteOne({ userId });
  }
}
