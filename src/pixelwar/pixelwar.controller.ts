import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PixelwarService } from './pixelwar.service';
import { CreatePixelwarDto } from './dto/create-pixelwar.dto';

@Controller('pixelwar')
@ApiTags('Pixelwar')
export class PixelwarController {
  constructor(private readonly pixelwarService: PixelwarService) {}

  @Get()
  @ApiOperation({ summary: 'Pixelwar configuration' })
  @ApiResponse({
    status: 200,
    description: 'Returns the pixelwar configuration',
  })
  async get() {
    return this.pixelwarService.get();
  }

  @Post()
  @ApiOperation({ summary: 'Create a pixelwar configuration' })
  @ApiResponse({
    status: 201,
    description: 'Returns the pixelwar configuration',
  })
  @ApiBody({
    type: CreatePixelwarDto,
    description: 'Pixelwar configuration',
  })
  async create(@Body() createPixelwarDto: CreatePixelwarDto) {
    return this.pixelwarService.create(createPixelwarDto);
  }
}
