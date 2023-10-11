import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum NotificationType {
  OPTIONS = 'options',
  FILE = 'file',
}

export class EmitPixelwarDto {
  @ApiProperty({
    description: 'It is a type of notification',
    example: 'options',
    required: true,
    type: String,
    enum: NotificationType,
    enumName: 'NotificationType',
  })
  @IsEnum(NotificationType)
  @IsNotEmpty()
  @IsString()
  @Expose()
  type: string;

  @ApiProperty({
    description: 'The guild id',
    required: true,
  })
  @Expose()
  guildId: string;
}
