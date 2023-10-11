import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetFileDto {
  @ApiProperty({
    description: 'The file name',
    required: true,
  })
  @Expose()
  filename: string;
}
