import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AvatarDocument = HydratedDocument<Avatar>;

@Schema()
export class Avatar extends AbstractDocument {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true })
  base64: string;

  @Prop({ required: true })
  size: number;
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);
