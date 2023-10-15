import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import { Document } from 'mongoose';

@Schema()
class DirectMessageWelcomeConfiguration extends Document {
    @Prop({ type: Boolean, default: false })
    @Expose()
    active: Boolean;

    @Prop({ type: String, default: null })
    @Expose()
    content: String;

    @Prop({
        type: Array<Object>, default: [
            {
                description: "Hello {user} and welcome to the {server}! You are the {membercount} of the server.",
                url: null,
                color: null,
                thumbnail: null,
                image: null,
                title: null,
            },
        ]
    })
    @Expose()
    embeds: Array<Object>;
}

@Schema()
class GuildWelcomeConfiguration extends Document {
    @Prop({ type: Number, default: 0 })
    @Expose()
    design: Number;

    @Prop({ type: Boolean, default: false })
    @Expose()
    active: Boolean;

    @Prop({ type: String, default: "" })
    @Expose()
    content: String;

    @Prop({ type: Boolean, default: true })
    @Expose()
    ping: Boolean;

    @Prop({ type: String, default: null, maxlength: 32 })
    @Expose()
    defaultPseudo: String;

    @Prop({ type: String, default: "0" })
    @Expose()
    channel: String;

    @Prop({ type: String, default: "#D89D20" })
    @Expose()
    colorAmbiance: String;

    @Prop({ type: String, default: "#D89D20" })
    @Expose()
    colorText: String;

    @Prop({ type: String, default: "https://media.discordapp.net/attachments/1014101467126304798/1055788116486660166/image.png" })
    @Expose()
    background: String;
}

@Schema()
export class WelcomeConfiguration extends Document {
    @Prop({ type: DirectMessageWelcomeConfiguration })
    @Expose()
    DM: DirectMessageWelcomeConfiguration;

    @Prop({ type: GuildWelcomeConfiguration })
    @Expose()
    guild: GuildWelcomeConfiguration;
}


export const WelcomeConfigurationSchema = SchemaFactory.createForClass(WelcomeConfiguration);
