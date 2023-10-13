import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document, Types, HydratedDocument, Schema } from 'mongoose';

const ChannelOnlySchema = new Schema({
    type: { type: String, enum: ['MEDIA', 'EMOTE', 'SLASHCOMMAND'] },
});

const guildconfiguration = new Schema({
    guild: { type: String, unique: true },
    logChannel: { type: String, default: "0" },
    sheesh: { type: Boolean, default: false },
    heyreaction: { type: Boolean, default: false },
    rename: { type: Boolean, default: false },
    musique: { type: Boolean, default: true },
    radio: { type: Boolean, default: true },
    playlist: { type: Boolean, default: true },
    fun: { type: Boolean, default: true },
    game: { type: Boolean, default: true },
    idBot: { type: String, default: process.env.BOTID },
    chaineTwitch: { type: String, default: "0" },
    idChannelTwitchTchat: { type: String, default: "0" },
    raid: { type: Boolean, default: false },
    camDisabled: { type: Boolean, default: false },
    camAccessRole: { type: Array, default: [] },
    bitrateUpdate: { type: Boolean, default: false },
    sendAchievement: { type: Boolean, default: true },
  
    discordStreak: {
      activate: { type: Boolean, default: false },
      roleStreak: { type: String, default: "0" },
      bearing: { type: Map, of: String, default: new Map() },
    },
  
    renameConfig: {
      normalizePseudo: { type: Boolean, default: false },
      RemoveIntentionallyTopList: { type: Boolean, default: true },
      wordsCheckType: { type: String, default: "EASY_CHECK", enum: ["EASY_CHECK", "HARD_CHECK"] },
      wordsList: { type: Array, default: [] },
    },
  
    muteRole: { type: String, default: null },
  
    welcome: {
      DM: {
        active: { type: Boolean, default: false },
        content: { type: String, default: null },
        embeds: {
          type: Array,
          default: [
            {
              description: "Hello {user} and welcome to the {server}! You are the {membercount} of the server.",
              url: null,
              color: null,
              thumbnail: null,
              image: null,
              title: null,
            },
          ]
        }
      },
      guild: {
        design: { type: Number, default: 0 },
        active: { type: Boolean, default: false },
        content: { type: String, default: "" },
        ping: { type: Boolean, default: true },
        defaultPseudo: { type: String, default: null, maxlength: 32 },
        channel: { type: String, default: "0" },
        colorAmbiance: { type: String, default: "#D89D20" },
        colorText: { type: String, default: "#FFFFFF" },
        background: { type: String, default: "https://media.discordapp.net/attachments/1014101467126304798/1055788116486660166/image.png" },
      }
    },
  
    rankCardLink: { type: String },
    rankCardColor: { type: Array },
    rankOverlayOpacity: { type: Number },
    rankOverlayColor: { type: String },
  
    welcomeRole: {
      active: { type: Boolean, default: false },
      roles: { type: Array, default: [] },
    },
  
    reactionChannel: { type: Map, of: Array, default: [] },
    channelOnly: { type: Map, of: ChannelOnlySchema, default: [] },
  
    gainRolesLevels: { type: Array, default: [] },
    gainRolesLevelsSend: { type: String, default: "none", enum: ['none', 'GUILD', 'DM'] },
    gainRolesLevelsOnlyActualRole: { type: Boolean, default: false },
  
    xpMessageType: { type: String, default: "none", enum: ['none', 'ACTUAL_CHANNEL', 'CUSTOM_CHANNEL', 'DM'] },
    xpMessageChannel: { type: String, default: "0" },
    xpMessage: { type: String, default: null },
  
    xpConfig: {
      multiplicator: { type: Number, default: 1 },
      disabled: { type: Boolean, default: false },
  
      channelType: { type: String, default: "ALL_WITHOUT", enum: ['ALL_WITHOUT', 'WITHOUT_EXCEPT'] },
      channels: { type: Array, default: [] },
  
      rolesType: { type: String, default: "ALL_WITHOUT", enum: ['ALL_WITHOUT', 'WITHOUT_EXCEPT'] },
      roles: { type: Array, default: [] },
    },
  
    oldCommand: { type: Boolean, default: true },
    prefix: { type: String, default: null },
  
    counterChannel: { type: String, default: null },
    counterAcceptDuplication: { type: Boolean, default: false },
  
    counterRole: {
      10: { type: String, default: null },
      100: { type: String, default: null },
      1000: { type: String, default: null },
      10000: { type: String, default: null },
      100000: { type: String, default: null },
      1000000: { type: String, default: null },
    },
  
    counterUser: {
      10: { type: String, default: null },
      100: { type: String, default: null },
      1000: { type: String, default: null },
      10000: { type: String, default: null },
      100000: { type: String, default: null },
      1000000: { type: String, default: null },
    },
  
    starChannel: { type: String, default: null },
    starMinCount: { type: Number, default: -1 },
  
    activityRole: { type: Array, default: [] },
    activityRoleSendMessage: { type: Boolean, default: false },
  
    webhookLink: {
      game: { type: String, default: null },
    },
    webhookKey: { type: String, default: null },
  
    logs: {
      message: { type: String, default: "0" },
      vocal: { type: String, default: "0" },
      user: { type: String, default: "0" },
      ban_unban: { type: String, default: "0" },
      join_leave: { type: String, default: "0" },
      guild: { type: String, default: "0" },
      roles: { type: String, default: "0" },
      channels: { type: String, default: "0" },
      invites: { type: String, default: "0" },
      emotes_stickers: { type: String, default: "0" },
    },
  
    volumeLevel: { type: Number, default: 40 },
  }, {
    timestamps: true,
  });


export const GuildConfigurationSchema = mongoose.model('guildConfiguration', guildconfiguration);
