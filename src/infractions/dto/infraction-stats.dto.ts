import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class InfractionStatsDto {
  @ApiProperty({
    type: Number,
    description: 'Total of infractions',
    required: true,
    example: 230,
  })
  @Expose()
  total: Number;

  @ApiProperty({
    type: Number,
    description: 'Total of active infractions',
    required: true,
    example: 34,
  })
  @Expose()
  active: Number;

  @ApiProperty({
    type: Number,
    description: 'Total of ban infractions',
    required: true,
    example: 52,
  })
  @Expose()
  ban: Number;

  @ApiProperty({
    type: Number,
    description: 'Total of mute infractions',
    required: true,
    example: 39,
  })
  @Expose()
  mute: Number;

  @ApiProperty({
    type: Number,
    description: 'Total of warn infractions',
    required: true,
    example: 123,
  })
  @Expose()
  warn: Number;
}
