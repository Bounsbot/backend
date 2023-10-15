import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import { Document } from 'mongoose';

@Schema()
export class LogsConfiguration extends Document {
    @Prop({ type: String, default: "0" })
    @Expose()
    message: String;

    @Prop({ type: String, default: "0" })
    @Expose()
    vocal: String;

    @Prop({ type: String, default: "0" })
    @Expose()
    user: String;

    @Prop({ type: String, default: "0" })
    @Expose()
    ban_unban: String;

    @Prop({ type: String, default: "0" })
    @Expose()
    join_leave: String;

    @Prop({ type: String, default: "0" })
    @Expose()
    guild: String;

    @Prop({ type: String, default: "0" })
    @Expose()
    roles: String;

    @Prop({ type: String, default: "0" })
    @Expose()
    channels: String;

    @Prop({ type: String, default: "0" })
    @Expose()
    invites: String;

    @Prop({ type: String, default: "0" })
    @Expose()
    emotes_stickers: String;

    @Prop({ type: Number, default: 40 })
    volumeLevel: Number;
}

export const LogsConfigurationSchema = SchemaFactory.createForClass(LogsConfiguration);
