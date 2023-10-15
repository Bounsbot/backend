import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import { Document } from 'mongoose';

@Schema()
export class WelcomeRoleConfiguration extends Document {
    @Prop({ type: Boolean, default: false })
    @Expose()
    active: Boolean;

    @Prop({ type: Array<String>, default: [] })
    @Expose()
    roles: Array<String>;
}

export const WelcomeRoleConfigurationSchema = SchemaFactory.createForClass(WelcomeRoleConfiguration);
