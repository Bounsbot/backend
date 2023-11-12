import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document, Types, HydratedDocument } from 'mongoose';

// export type GlobalLevelDocument = GlobalLevel & Document;
export type AuthDocument = HydratedDocument<Auth>;

@Schema({
    collection: "Authentification",
    timestamps: false,
})
export class Auth {
    // @ApiProperty({
    //     type: String,
    //     description: "id of the level",
    // })
    // @Prop({ type: String })
    // _id: string;

    @ApiProperty({
        type: String,
        description: "User identifiant",
    })
    @Prop({ type: String })
    discordId: string;

    @ApiProperty({
        type: String,
        description: "access token of the user",
    })
    @Prop({ type: String })
    accessToken: string;

    @ApiProperty({
        type: String,
        description: "refresh token of the user",
    })
    @Prop({ type: String })
    refreshToken: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
