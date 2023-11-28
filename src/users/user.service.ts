import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventGateway } from 'src/event/event.gateway';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { VoteDto } from './dto/vote.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private user: Model<UserDocument>,

    private eventService: EventGateway,
    @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
  ) { }

  async updateTopGGVote(voteObject: VoteDto) {
    let user = await this.user.findOne({ id: voteObject.user })
    if (!user) {
      user = new this.user({ id: voteObject.user })
    }

    user.achievement.topggVote = (user.achievement.topggVote + 1) || 1
    await user.save()

    this.eventService.server.emit('NEW_VOTE', { user: voteObject.user, totalVote: user.achievement.topggVote })
  }
}
