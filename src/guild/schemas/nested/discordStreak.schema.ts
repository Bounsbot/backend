import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import { Document } from 'mongoose';

@Schema()
export class DiscordStreak extends Document {
    @Prop({ type: Boolean, default: false })
    @Expose()
    activate: Boolean;

    @Prop({ type: String, default: "0" })
    @Expose()
    roleStreak: Boolean;

    @Prop({ type: Map, default: new Map() })
    @Expose()
    bearing: Map<String, Array<String>>;
}


export const DiscordStreakSchema = SchemaFactory.createForClass(DiscordStreak);
