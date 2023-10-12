import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { GlobalLevel, GlobalLevelDocument } from './schemas/globalLevel.schema';
import { GuildLevel, GuildLevelDocument } from './schemas/guildLevel.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';

@Injectable()
export class LevelsService {
    constructor(
        @InjectModel(GlobalLevel.name)
        private globalLevel: Model<GlobalLevelDocument>,

        @InjectModel(GuildLevel.name)
        private guildLevel: Model<GuildLevelDocument>,

        @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
    ) { }

    async findAll() {
        return await this.globalLevel.find().exec();
    }

    async findGlobalLevelWithPagination(page: number = 0, limit: number = 100) {
        let globalLevel = await this.cacheManager.get<GlobalLevel[]>('GLOBAL_LEVELS_' + page + '_' + limit)

        if (globalLevel) return globalLevel;

        globalLevel = await this.globalLevel.find({ dataCollection: true }, { identifiant: -1, username: -1, xp: -1, nbMessage: -1, picture: -1 }).sort({ xp: -1 }).limit(limit).skip(100 * page).exec()

        this.cacheManager.set('GLOBAL_LEVELS_' + page + '_' + limit, globalLevel, { ttl: 120 })

        return globalLevel
    }

    async findGuildLevelWithPagination(guildId: string, page: number = 0, limit: number = 100) {
        return await this.guildLevel.find({ idserveur: guildId }, { identifiant: -1, username: -1, xp: -1, nbMessage: -1, picture: -1 }).sort({ xp: -1 }).limit(limit).skip(100 * page).exec()
    }
}
