import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Pixelwar } from '../schemas/pixelwar.schema';

export class PixelwarDto {
  @ApiProperty({
    description: 'pixelwar parameters',
    required: true,
  })
  @Expose()
  pixelwar: Pixelwar;

  @ApiProperty({
    description: 'The file in buffer',
    required: true,
  })
  @Expose()
  file: Buffer;
}
