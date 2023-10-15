import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import { Document } from 'mongoose';

@Schema()
export class PalierConfiguration extends Document {
    @Prop({ type: String, default: null })
    @Expose()
    10: String;

    @Prop({ type: String, default: null })
    @Expose()
    100: String;

    @Prop({ type: String, default: null })
    @Expose()
    1000: String;

    @Prop({ type: String, default: null })
    @Expose()
    10000: String;

    @Prop({ type: String, default: null })
    @Expose()
    100000: String;

    @Prop({ type: String, default: null })
    @Expose()
    1000000: String;
}

export const PalierConfigurationSchema = SchemaFactory.createForClass(PalierConfiguration);
