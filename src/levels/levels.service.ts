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
}
