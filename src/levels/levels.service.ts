import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { GlobalLevel, GlobalLevelDocument } from './schemas/globalLevel.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class LevelsService {
    constructor(
        @InjectModel(GlobalLevel.name)
        private readonly globalLevel: Model<GlobalLevelDocument>,
    ) { }

    async findAll() {
        return await this.globalLevel.find().exec();
    }

    async findGlobalLevelWithPagination(page: number = 0, limit: number = 100) {
        return await this.globalLevel.find({ dataCollection: true }).sort({ xp: -1 }).limit(limit).skip(100 * page).exec()
    }

    async findGuildLevelWithPagination(guild: string, page: number = 0, limit: number = 100) {
        return await this.globalLevel.find({ dataCollection: true }).sort({ xp: -1 }).limit(limit).skip(100 * page).exec()
    }
}
