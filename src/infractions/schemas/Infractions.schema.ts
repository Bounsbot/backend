import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document, Types, HydratedDocument } from 'mongoose';

export type InfractionsDocument = HydratedDocument<Infractions>;

@Schema({
    collection: "infractions",
    timestamps: true,
})
export class Infractions {
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
    id: String;

    @ApiProperty({
        type: String,
        description: "User identifiant",
    })
    @Prop({ type: String })
    userId: String;

    @ApiProperty({
        type: String,
        description: "Guild identifiant",
    })
    @Prop({ type: String })
    guildId: String;

    @ApiProperty({
        type: String,
        description: "Type of infraction",
    })
    @Prop({ type: String, enum: ['WARN', 'TEMPMUTE', 'TEMPBAN', 'MUTE', 'BAN', 'TIMEOUT'], default: 'WARN' })
    type: String;

    @ApiProperty({
        type: String,
        description: "Reason of infraction",
    })
    @Prop({ type: String })
    reason: String;

    @ApiProperty({
        type: String,
        description: "Moderator identifiant",
    })
    @Prop({ type: String })
    moderatorId: String;

    @ApiProperty({
        type: String,
        description: "Duration of infraction",
    })
    @Prop({ type: Number })
    duration: Number;

    @ApiProperty({
        type: String,
        description: "Status of infraction",
    })
    @Prop({ type: String, enum: ['ACTIVE', 'EXPIRED', 'REVOKED'], default: 'ACTIVE' })
    status: String;

    @ApiProperty({
        type: String,
        description: "Revoke timestamp of infraction",
    })
    @Prop({ type: Number })
    revokeTimestamp: Number;

    @ApiProperty({
        type: String,
        description: "Revoke reason of infraction",
    })
    @Prop({ type: String })
    revokeReason: String;
}

export const InfractionsSchema = SchemaFactory.createForClass(Infractions);
