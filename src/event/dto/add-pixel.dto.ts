import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

class Cord {
  @ApiProperty({
    description: 'The pixel x position',
    required: true,
    example: 0,
  })
  @Expose()
  x: number;

  @ApiProperty({
    description: 'The pixel y position',
    required: true,
    example: 0,
  })
  @Expose()
  y: number;
}

export class AddPixelDto {
  @ApiProperty({
    description: 'The guild id',
    required: true,
  })
  @Expose()
  guildId: string;

  @ApiProperty({
    description: 'The pixel color',
    required: true,
    example: '#000000',
  })
  @Expose()
  color: string;

  @ApiProperty({
    description: 'The pixel cord',
    required: true,
    example: {
      x: 0,
      y: 0,
    },
  })
  @Expose()
  cord: Cord;
}
