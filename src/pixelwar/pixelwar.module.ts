import { Module } from '@nestjs/common';
import { PixelwarService } from './pixelwar.service';
import { PixelwarController } from './pixelwar.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PixelwarSchema } from './schemas/pixelwar.schema';
import { S3Module } from '../S3/S3.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Pixelwar', schema: PixelwarSchema }]),
    S3Module,
  ],
  controllers: [PixelwarController],
  providers: [PixelwarService],
  exports: [PixelwarService],
})
export class PixelwarModule {}
