import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import { Document } from 'mongoose';

@Schema()
export class RenameConfiguration extends Document {
    @Prop({ type: Boolean, default: false })
    @Expose()
    normalizePseudo: Boolean;

    @Prop({ type: Boolean, default: true })
    @Expose()
    RemoveIntentionallyTopList: Boolean;

    @Prop({ type: String, default: "EASY_CHECK", enum: ["EASY_CHECK", "HARD_CHECK"] })
    @Expose()
    wordsCheckType: String;

    @Prop({ type: Array<String>, default: [] })
    @Expose()
    wordsList: Array<String>;
}


export const RenameConfigurationSchema = SchemaFactory.createForClass(RenameConfiguration);
