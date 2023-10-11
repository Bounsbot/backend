import { Inject, Injectable } from '@nestjs/common';
import { Pixelwar, PixelwarDocument } from './schemas/pixelwar.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PixelwarCreatedExecption,
  PixelwarAlreadyExistException,
} from './pixelwar.exception';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { Canvas, createCanvas } from 'canvas';
import { S3Service } from '../S3/S3.service';
import { PixelwarDto } from './dto/pixelwar.dto';
import { CreatePixelwarDto } from './dto/create-pixelwar.dto';

@Injectable()
export class PixelwarService {
  public constructor(
    @InjectModel(Pixelwar.name) private pixelwarModel: Model<PixelwarDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
    private readonly s3Service: S3Service,
  ) {}

  async create(createPixelwarDto: CreatePixelwarDto): Promise<Pixelwar> {
    try {
      const pixelwar = await this.pixelwarModel.findOne({
        guildId: '1108033923780460556',
      });

      if (pixelwar) {
        throw new PixelwarAlreadyExistException();
      }

      const newPixelwar = new this.pixelwarModel({
        guildId: '1108033923780460556',
        options: {
          colors: createPixelwarDto.colors,
          size: createPixelwarDto.size,
          cooldown: createPixelwarDto.cooldown,
        },
      });

      await this.cacheManager.set(newPixelwar.guildId, newPixelwar, {
        ttl: 160,
      });

      const canvas = this.createCanvas(newPixelwar);

      await this.s3Service.set({
        file: canvas.toBuffer('image/png'),
        filename: newPixelwar.guildId,
      });

      return await newPixelwar.save();
    } catch (e) {
      console.error(e);
      throw new PixelwarCreatedExecption();
    }
  }

  async get(): Promise<PixelwarDto> {
    const pixelwar = await this.getPixelwar();

    const buffer = await this.s3Service.getObject({
      filename: '1108033923780460556',
    });

    return {
      pixelwar,
      file: buffer.Body as Buffer,
    };
  }

  async getPixelwar(): Promise<Pixelwar> {
    const cachedPixelwar = await this.cacheManager.get<object>(
      '1108033923780460556',
    );

    if (cachedPixelwar) {
      return new this.pixelwarModel(cachedPixelwar);
    }

    const pixelwar = await this.pixelwarModel.findOne({
      guildId: '1108033923780460556',
    });

    await this.cacheManager.set(pixelwar.guildId, pixelwar, { ttl: 160 });

    return pixelwar;
  }

  createCanvas(pixelwar: Pixelwar): Canvas {
    const canvas = createCanvas(
      pixelwar.options.size[0],
      pixelwar.options.size[1],
    );

    const ctx = canvas.getContext('2d');

    ctx.save();

    return canvas;
  }
}
