import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Avatar } from '../schemas/avatar.schema';

@Injectable()
export class AvatarRepository extends AbstractRepository<Avatar> {
  protected readonly logger = new Logger(AvatarRepository.name);

  constructor(
    @InjectModel(Avatar.name) model: Model<Avatar>,
    @InjectConnection() connection: Connection,
  ) {
    super(model, connection);
  }
}
