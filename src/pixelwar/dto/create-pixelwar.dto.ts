import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreatePixelwarDto {
  @ApiProperty({
    description: "The pixelwar's colors",
    example: ['#000000', '#ffffff'],
    required: false,
  })
  @ArrayUnique()
  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  @Expose()
  colors?: string[];

  @ApiProperty({
    description: 'The pixelwar size',
    example: [1000, 1000],
    required: false,
  })
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsOptional()
  @Expose()
  size?: number[];

  @ApiProperty({
    description: 'The pixelwar cooldown',
    example: 6000,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  cooldown?: number;
}
