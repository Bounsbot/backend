import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document, Types, HydratedDocument } from 'mongoose';
import { Achievement } from './nested/achievement.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({
    collection: "userinformations",
    timestamps: true,
})
export class User {
    @ApiProperty({
        type: String,
        description: "User identifiant",
    })
    @Prop({ type: String })
    identifiant: string;

    @ApiProperty({
        type: String,
        description: "User username",
    })
    @Prop({ type: String })
    username: string;

    @ApiProperty({
        type: String,
        description: "User picture",
    })
    @Prop({ type: String })
    picture: string;

    @ApiProperty({
        type: String,
        description: "user email",
    })
    @Prop({ type: String })
    email: string;

    @Prop({ type: Achievement })
    achievement: Achievement;
}

export const UserSchema = SchemaFactory.createForClass(User);
