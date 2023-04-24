import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AvatarDto {
  @IsString()
  @IsNotEmpty()
  originalName: string;

  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @IsNumber()
  size: number;

  @IsString()
  @IsNotEmpty()
  base64: string;
}
