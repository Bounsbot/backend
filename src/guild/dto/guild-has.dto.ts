import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class GuildHasDto {
  @ApiProperty({
    type: String,
    description: 'An array of guild want to check',
    required: true,
    example: '["705198568067301457","345198568065381457","529498568067318455"]',
  })
  @Expose()
  has: Array<string>;
}
