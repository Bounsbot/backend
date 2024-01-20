import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types, HydratedDocument } from 'mongoose';
import { DiscordStreak } from './nested/discordStreak.schema';
import { RenameConfiguration } from './nested/renameConfiguration.schema';
import { WelcomeConfiguration } from './nested/welcomeConfiguration.schema';
import { WelcomeRoleConfiguration } from './nested/welcomeRole.schema';
import { XpConfiguration } from './nested/xpConfiguration.schema';
import { PalierConfiguration } from './nested/PalierConfiguration.schema';
import { gainRolesLevelsConfiguration } from './nested/gainRolesLevels.schema';
import { LogsConfiguration } from './nested/logsConfiguration.schema';
import { AutoInfractions } from './nested/autoInfractions.schema';

// export type GlobalLevelDocument = GlobalLevel & Document;
export type GuildConfigurationDocument = HydratedDocument<GuildConfiguration>;

@Schema({
  collection: "guildconfigurations",
  timestamps: true,
})
export class GuildConfiguration {
  @Prop({ type: String, unique: true })
  guild: String;

  @Prop({ type: String, default: "0" })
  logChannel: String;

  @Prop({ type: Boolean, default: false })
  sheesh: Boolean;

  @Prop({ type: Boolean, default: false })
  phoneticPun: Boolean;

  @Prop({ type: Boolean, default: false })
  heyreaction: Boolean;

  @Prop({ type: Boolean, default: false })
  rename: Boolean;

  @Prop({ type: Boolean, default: true })
  musique: Boolean;

  @Prop({ type: Boolean, default: true })
  radio: Boolean;

  @Prop({ type: Boolean, default: true })
  playlist: Boolean;

  @Prop({ type: Boolean, default: true })
  fun: Boolean;

  @Prop({ type: Boolean, default: true })
  game: Boolean;

  @Prop({ type: String, default: "0" })
  chaineTwitch: String;

  @Prop({ type: String, default: "0" })
  idChannelTwitchTchat: String;

  @Prop({ type: Boolean, default: false })
  raid: Boolean;

  @Prop({ type: Boolean, default: false })
  camDisabled: Boolean;

  @Prop({ type: Array, default: [] })
  camAccessRole: Array<String>;

  @Prop({ type: Boolean, default: false })
  bitrateUpdate: Boolean;

  @Prop({ type: Boolean, default: true })
  sendAchievement: Boolean;

  @Prop({ type: DiscordStreak })
  discordStreak: DiscordStreak;

  @Prop({ type: RenameConfiguration })
  renameConfig: RenameConfiguration

  @Prop({ type: String, default: null })
  muteRole: String

  @Prop({ type: WelcomeConfiguration, default: null })
  welcome: WelcomeConfiguration

  @Prop({ type: String })
  rankCardLink: String

  @Prop({ type: Array<String> })
  rankCardColor: Array<String>

  @Prop({ type: Number })
  rankOverlayOpacity: Number

  @Prop({ type: String })
  rankOverlayColor: String

  @Prop({ type: WelcomeRoleConfiguration })
  welcomeRole: WelcomeRoleConfiguration

  @Prop({ type: Map, default: [] })
  reactionChannel: Map<String, Array<String>>

  @Prop({ type: Array, default: [] })
  channelOnly: Map<string, Array<Object>>

  @Prop({ type: Array<gainRolesLevelsConfiguration>, default: [] })
  gainRolesLevels: Array<gainRolesLevelsConfiguration>

  @Prop({ type: String, default: "none", enum: ["none", 'GUILD', 'DM'] })
  gainRolesLevelsSend: String

  @Prop({ type: Boolean, default: false })
  gainRolesLevelsOnlyActualRole: Boolean

  @Prop({ type: String, default: "none", enum: ["none", 'ACTUAL_CHANNEL', 'CUSTOM_CHANNEL', 'DM'] })
  xpMessageType: String

  @Prop({ type: String, default: "0" })
  xpMessageChannel: String

  @Prop({ type: String, default: null })
  xpMessage: String

  @Prop({ type: XpConfiguration })
  xpConfig: XpConfiguration

  @Prop({ type: Boolean, default: true })
  oldCommand: Boolean

  @Prop({ type: String, default: null })
  prefix: String

  @Prop({ type: String, default: null })
  counterChannel: { type: String, default: null }

  @Prop({ type: Boolean, default: null })
  counterAcceptDuplication: Boolean

  @Prop({ type: PalierConfiguration })
  counterRole: PalierConfiguration

  @Prop({ type: PalierConfiguration })
  counterUser: PalierConfiguration

  @Prop({ type: String, default: null })
  starChannel: String

  @Prop({ type: Number, default: -1 })
  starMinCount: Number

  @Prop({ type: Array, default: [] })
  activityRole: Array<String>

  @Prop({ type: Boolean, default: false })
  activityRoleSendMessage: Boolean

  @Prop({ type: LogsConfiguration, default: {} })
  logs: LogsConfiguration

  @Prop({ type: String, default: null })
  banAppealUrl: String

  @Prop({
    type: Array<AutoInfractions>, default: []
  })
  autoInfractions: Array<AutoInfractions>
}

export const GuildConfigurationSchema = SchemaFactory.createForClass(GuildConfiguration);
