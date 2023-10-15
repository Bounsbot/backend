import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import { Document } from 'mongoose';

@Schema()
class RoleConfiguration extends Document {
    @Prop({ type: String, default: null })
    @Expose()
    id: String;

    @Prop({ type: String, default: null })
    @Expose()
    name: String;

    @Prop({ type: String, default: null })
    @Expose()
    color: String;
}

@Schema()
export class gainRolesLevelsConfiguration extends Document {
    @Prop({ type: Number, default: false })
    @Expose()
    level: number;

    @Prop({ type: RoleConfiguration, default: [] })
    @Expose()
    role: RoleConfiguration;
}

export const gainRolesLevelsConfigurationSchema = SchemaFactory.createForClass(gainRolesLevelsConfiguration);
