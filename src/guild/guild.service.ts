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

        let roleChecker = (await this.eventService.server.timeout(1000).emitWithAck('ROLE_LEVEL_UPDATE', guildId, roles)).find((e) => e !== null)

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

        this.cacheManager.del(`guild-config:${guild}`)

        return await this.guildConfiguration.updateOne({ guild }, configuration, { upsert: true }).exec()
    }
}
