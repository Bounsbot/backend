import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreateFileDto {
  @ApiProperty({
    description: 'The file name',
    required: false,
    default: '',
    example: 'test.png',
  })
  @Expose()
  filename: string;

  @ApiProperty({
    description: 'The file in buffer',
    required: true,
  })
  @Expose()
  file: Buffer;
}
