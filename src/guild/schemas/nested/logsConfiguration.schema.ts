import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import { Document } from 'mongoose';

@Schema()
export class LogsConfiguration extends Document {
    @Prop({ type: Array<String>, default: [] })
    @Expose()
    excludeMessageChannels: Array<String>;

    @Prop({ type: Array<String>, default: [] })
    @Expose()
    excludeVocalChannels: Array<String>;

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

    @Prop({ type: String, default: "0" })
    infractions: String;
}

export const LogsConfigurationSchema = SchemaFactory.createForClass(LogsConfiguration);
