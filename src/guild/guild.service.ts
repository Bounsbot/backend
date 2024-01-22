import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GuildConfiguration, GuildConfigurationDocument } from './schemas/guildConfiguration.schema';
import { EventGateway } from 'src/event/event.gateway';
import { ConfigurationNotExistException } from './guild.exception';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';

@Injectable()
export class GuildService {
    constructor(
        @InjectModel(GuildConfiguration.name)
        private guildConfiguration: Model<GuildConfigurationDocument>,

        private eventService: EventGateway,
        @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
    ) { }

    async getRoleLevelConfiguration(guildId: String) {
        return await this.guildConfiguration.findOne({ guild: guildId }, { gainRolesLevels: -1, rankCardLink: -1, rankOverlayColor: -1, rankCardColor: -1 }).exec()
    }

    async checkLevelRoles(guildId: String, configuration: GuildConfiguration) {
        if ((!configuration) || (!configuration.gainRolesLevels)) return []

        let roles = configuration.gainRolesLevels.sort((a, b) => a.level - b.level)

        let roleChecker = (await this.eventService.server.timeout(3000).emitWithAck('ROLE_LEVEL_UPDATE', guildId, roles)).find((e) => e !== null)

        if (roles.length != roleChecker.length) {
            configuration.gainRolesLevels = roleChecker
            this.guildConfiguration.updateOne({ guild: guildId }, { gainRolesLevels: roleChecker }).exec()
        }

        return roleChecker
    }

    async getConfig(guildId: String) {
        return await this.guildConfiguration.findOne({ guild: guildId }).exec()
    }

    async updateConfiguration(guild: String, configuration: GuildConfiguration) {
        if (!configuration) throw new ConfigurationNotExistException()
        delete configuration.guild

        if ('chaineTwitch' in configuration || 'idChannelTwitchTchat' in configuration) {
            const key: any = await this.cacheManager.get(`guild-config:${guild}`);
            let oldChannelTwitch: String | null = null;
            let oldTranscriptChannel: String | null = null;
            let newChannelTwitch: String | null = null;
            let newTranscriptChannel: String | null = null;

            if (key) {
                oldChannelTwitch = key?.chaineTwitch;
                oldTranscriptChannel = key?.idChannelTwitchTchat;
            } else {
                const oldConfig = await this.guildConfiguration.findOne({ guild }).exec();
                if (oldConfig) {
                    oldChannelTwitch = oldConfig.chaineTwitch;
                    oldTranscriptChannel = oldConfig.idChannelTwitchTchat;
                }
            }

            newChannelTwitch = configuration.chaineTwitch ?? oldChannelTwitch;
            newTranscriptChannel = configuration.idChannelTwitchTchat ?? oldTranscriptChannel;

            if (oldChannelTwitch && oldTranscriptChannel) {
                this.eventService.server.emit('UPDATE_TWITCH_TRANSCRIPT', { oldChannelTwitch, oldTranscriptChannel, newChannelTwitch, newTranscriptChannel });
            }
        }

        await this.cacheManager.del(`guild-config:${guild}`)

        return await this.guildConfiguration.updateOne({ guild }, configuration, { upsert: true }).exec()
    }
}
