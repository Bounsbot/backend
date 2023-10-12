import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document, Types } from 'mongoose';

export type GlobalLevelDocument = GlobalLevel & Document;

@Schema({
    collection: 'userInformation'
})
export class GlobalLevel {
    @ApiProperty({
        type: String,
        description: "id of the level",
    })
    @Prop({ type: String })
    _id: String;

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
        type: Number,
        description: "Number of message",
    })
    @Prop({ type: Number })
    nbMessage: Number;

    @ApiProperty({
        type: Number,
        description: "Xp of the user",
    })
    @Prop({ type: Number })
    xp: Number;
}

export const GlobalLevelSchema = SchemaFactory.createForClass(GlobalLevel);
