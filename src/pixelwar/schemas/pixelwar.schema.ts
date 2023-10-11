import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import { Options, OptionsSchema } from './nested/options.schema';

export type PixelwarDocument = HydratedDocument<Pixelwar>;

@Schema({
  timestamps: true,
})
export class Pixelwar {
  @ApiProperty({
    type: String,
    description: "It's the ID of the discord guild",
    required: true,
  })
  @Prop({ type: String, required: true })
  guildId: string;

  @ApiProperty({
    type: Options,
    description: "It's a Pixelwar options object",
    required: true,
  })
  @Prop({ type: OptionsSchema, required: true, default: () => new Options() })
  options: Options;
}

export const PixelwarSchema = SchemaFactory.createForClass(Pixelwar);
