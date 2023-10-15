import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import { Document } from 'mongoose';

@Schema()
export class XpConfiguration extends Document {
    @Prop({ type: Number, default: 1 })
    @Expose()
    multiplicator: Number;

    @Prop({ type: Boolean, default: false })
    @Expose()
    disable: Boolean;

    @Prop({ type: String, default: "ALL_WITHOUT", enum: ['ALL_WITHOUT', 'WITHOUT_EXCEPT'] })
    @Expose()
    channelType: String;

    @Prop({ type: Array, default: [] })
    @Expose()
    channels: Array<String>;


    @Prop({ type: String, default: "ALL_WITHOUT", enum: ['ALL_WITHOUT', 'WITHOUT_EXCEPT'] })
    @Expose()
    rolesType: String;

    @Prop({ type: Array, default: [] })
    @Expose()
    roles: Array<String>;

}

export const XpConfigurationSchema = SchemaFactory.createForClass(XpConfiguration);
