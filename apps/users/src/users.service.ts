import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './repositories/users.repository';
import { AvatarRepository } from './repositories/avatar.repository';
import { AvatarDto } from './dto/create-avatar.dto';

@Injectable()
export class UsersService {
  constructor(
    private userRepository: UsersRepository,
    private avatarRepository: AvatarRepository,
  ) {}

  async createUser(request: CreateUserDto) {
    return this.userRepository.create(request);
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
