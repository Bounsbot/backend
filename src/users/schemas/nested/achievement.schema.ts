import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import { Document } from 'mongoose';

@Schema()
export class Achievement extends Document {
    @Prop({ type: Number, default: 0 })
    @Expose()
    nbCommande: number;

    @Prop({ type: Number, default: 0 })
    @Expose()
    dj: number;

    @Prop({ type: Boolean, default: false })
    @Expose()
    botInYouGuild: boolean;

    @Prop({ type: Boolean, default: false })
    @Expose()
    onBounsGuild: boolean;

    @Prop({ type: Boolean, default: false })
    @Expose()
    seeSecretCommand: boolean;

    @Prop({ type: Boolean, default: false })
    @Expose()
    customBanner: boolean;

    @Prop({ type: Boolean, default: false })
    @Expose()
    bugHunter: boolean;

    @Prop({ type: Number, default: 0 })
    @Expose()
    topggVote: number;

}

export const AchievementSchema = SchemaFactory.createForClass(Achievement);
