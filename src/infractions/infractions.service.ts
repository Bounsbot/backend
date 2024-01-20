import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Infractions, InfractionsDocument } from './schemas/Infractions.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { EventGateway } from 'src/event/event.gateway';

@Injectable()
export class InfractionsService {
    constructor(
        @InjectModel(Infractions.name)
        private infractions: Model<InfractionsDocument>,

        private eventService: EventGateway,
        @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
    ) { }

    async generateInfractionStats(guildId: String) {
        try {
            const stats = await this.infractions.aggregate([
                { $match: { guildId: guildId } },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        active: { $sum: { $cond: [{ $eq: ['$status', 'ACTIVE'] }, 1, 0] } },
                        ban: { $sum: { $cond: [{ $eq: ['$type', 'BAN'] }, 1, 0] } },
                        tempban: { $sum: { $cond: [{ $eq: ['$type', 'TEMPBAN'] }, 1, 0] } },
                        mute: { $sum: { $cond: [{ $eq: ['$type', 'MUTE'] }, 1, 0] } },
                        tempmute: { $sum: { $cond: [{ $eq: ['$type', 'TEMPMUTE'] }, 1, 0] } },
                        timeout: { $sum: { $cond: [{ $eq: ['$type', 'TIMEOUT'] }, 1, 0] } },
                        warn: { $sum: { $cond: [{ $eq: ['$type', 'WARN'] }, 1, 0] } },
                    },
                },
            ]);

            const statsInfractions = {
                total: 0,
                active: 0,
                ban: 0,
                tempban: 0,
                mute: 0,
                tempmute: 0,
                timeout: 0,
                warn: 0,
            };

            if (stats.length > 0) {
                Object.keys(statsInfractions).forEach((key) => {
                    if (stats[0][key] !== undefined) {
                        statsInfractions[key] = stats[0][key];
                    }
                });
            }

            return statsInfractions;
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques d\'infraction :', error);
            throw error;
        }
    }

    async generateModeratorStats(guildId: String) {
        const stats = await this.infractions.aggregate([
            { $match: { guildId } },
            {
                $group: {
                    _id: '$moderatorId',
                    total: { $sum: 1 },
                    ban: { $sum: { $cond: [{ $eq: ['$type', 'BAN'] }, 1, 0] } },
                    tempban: { $sum: { $cond: [{ $eq: ['$type', 'TEMPBAN'] }, 1, 0] } },
                    mute: { $sum: { $cond: [{ $eq: ['$type', 'MUTE'] }, 1, 0] } },
                    tempmute: { $sum: { $cond: [{ $eq: ['$type', 'TEMPMUTE'] }, 1, 0] } },
                    timeout: { $sum: { $cond: [{ $eq: ['$type', 'TIMEOUT'] }, 1, 0] } },
                    warn: { $sum: { $cond: [{ $eq: ['$type', 'WARN'] }, 1, 0] } },
                },
            },
        ]);

        const modId = stats.map((e) => e._id).filter((e, i, a) => a.indexOf(e) === i);

        const socketKey = Array.from(this.eventService.server.sockets.keys())

        let moderatorInfo = (await this.eventService.server.to(socketKey[Math.floor(Math.random() * socketKey.length)]).timeout(1000).emitWithAck('FETCH_USERS', modId)).find((e) => e !== null)

        if (!moderatorInfo) moderatorInfo = []

        const moderatorStats = stats.map((e) => {
            const moderator = moderatorInfo.find((m) => m.id === e._id);
            return {
                ...e,
                moderator: moderator ? moderator : null,
            };
        }).sort((a, b) => b.total - a.total);

        return moderatorStats;
    }

    async findInfractionsWithPagination(page: number, limit: number, guildId: String) {
        const infractions = await this.infractions.find({ guildId }).sort({ createdAt: -1 }).skip(page * limit).limit(limit).lean()


        //je veux une map avec moderatorId et userId  mais flat
        const id = infractions.reduce((acc, e) => {
            acc.push(e.userId, e.moderatorId);
            return acc;
        }, []).filter((e, i, a) => a.indexOf(e) === i);

        const socketKey = Array.from(this.eventService.server.sockets.keys())

        let users = (await this.eventService.server.to(socketKey[Math.floor(Math.random() * socketKey.length)]).timeout(1000).emitWithAck('FETCH_USERS', id)).find((e) => e !== null)

        if (!users) users = []

        const infractionsWithUser = infractions.map((e) => {
            const user = users.find((u) => u.id === e.userId);
            const moderator = users.find((u) => u.id === e.moderatorId);

            return {
                ...e,
                user: user ? user : null,
                moderator: moderator ? moderator : null,
            };
        });

        return infractionsWithUser;
    }
}
