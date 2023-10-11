import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { DateTime } from 'luxon';

@Schema({
  _id: false,
})
export class Options {
  @ApiProperty({
    type: [String],
    description: "It's the colors palette of the pixelwar",
    required: true,
  })
  @Prop({
    type: [String],
    default: ['#000000', '#FFFFFF', '#FF0000', '#0000FF', '#00FF00'],
  })
  colors: string[];

  @ApiProperty({
    type: [Number],
    description: "It's size of the pixelwar",
    required: true,
  })
  @Prop({ type: [Number], default: [1000, 1000] })
  size: number[];

  @ApiProperty({
    type: Number,
    description: "It's the cooldown of the pixelwar",
    required: true,
  })
  @Prop({ type: Number, default: 60 })
  cooldown: number;

  @ApiProperty({
    type: Date,
    description: "It's the closing date of the pixelwar",
    required: true,
  })
  @Prop({
    type: Date,
    default: () => DateTime.now().plus({ days: 3 }).toJSDate(),
  })
  closingDate: Date;
}

export const OptionsSchema = SchemaFactory.createForClass(Options);
