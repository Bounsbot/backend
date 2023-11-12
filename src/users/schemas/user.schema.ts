import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document, Types, HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
    collection: "userinformations",
    timestamps: true,
})
export class User {
    // @ApiProperty({
    //     type: String,
    //     description: "id of the level",
    // })
    // @Prop({ type: String })
    // _id: String;

    @ApiProperty({
        type: String,
        description: "User identifiant",
    })
    @Prop({ type: String })
    identifiant: String;

    @ApiProperty({
        type: String,
        description: "User username",
    })
    @Prop({ type: String })
    username: String;

    @ApiProperty({
        type: String,
        description: "User picture",
    })
    @Prop({ type: String })
    picture: String;

    @ApiProperty({
        type: String,
        description: "user email",
    })
    @Prop({ type: String })
    email: String;

}

export const UserSchema = SchemaFactory.createForClass(User);
