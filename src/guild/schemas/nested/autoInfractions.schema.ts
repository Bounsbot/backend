import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import { Document } from 'mongoose';

@Schema()
export class AutoInfractions extends Document {
    @Prop({ type: String, enum: ['WARN', 'TEMPMUTE', 'TEMPBAN', 'MUTE', 'BAN', 'TIMEOUT'], default: 'MUTE' })
    @Expose()
    action: String;

    @Prop({ type: Number, default: 60000 })
    @Expose()
    action_time: Number;

    @Prop({ type: String, enum: ['infraction'], default: 'infraction' })
    @Expose()
    target: String;

    @Prop({ type: Number, default: 1 })
    @Expose()
    target_count: Number;

    @Prop({ type: String, default: "2592000000" })
    @Expose()
    target_time: String;
}


export const AutoInfractionsSchema = SchemaFactory.createForClass(AutoInfractions);
