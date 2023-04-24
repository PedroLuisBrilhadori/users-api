import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  createUser(@Body() request: CreateUserDto) {
    return this.service.createUser(request);
  }

  @Get()
  getUsers(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.service.getUsers(page, limit);
  }

  @Get(':userId')
  getUser(@Param() { userId }) {
    return this.service.getUser(userId);
  }

  @Get(':userId/avatar')
  @UseInterceptors(FileInterceptor('image'))
  getAvatar(@Param() { userId }, @UploadedFile() file) {
    return this.service.getAvatar(userId, file);
  }

  @Delete(':userId/avatar')
  deleteAvatar(@Param() { userId }) {
    return this.service.deleteAvatar(userId);
  }
}
