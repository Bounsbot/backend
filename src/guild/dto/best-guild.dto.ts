import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class BestGuildDto {
  @ApiProperty({
    type: String,
    description: 'An array of best guild',
    required: true,
    example: '["705198568067301457","345198568065381457","529498568067318455"]',
  })
  @Expose()
  guilds: Array<Object>

  @ApiProperty({
    type: Number,
    description: 'Total guild',
    required: true,
    example: '3',
  })
  @Expose()
  totalGuild: Number;
}
