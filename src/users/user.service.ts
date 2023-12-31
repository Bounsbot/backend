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
  ) { }

  async updateTopGGVote(voteObject: VoteDto) {
    let user = await this.user.findOne({ identifiant: voteObject.user })
    if (!user) {
      user = new this.user({ identifiant: voteObject.user, achievement: { topggVote: 0 } })
    }

    user.achievement.topggVote = (user.achievement.topggVote + 1) || 1
    await user.save()

    this.eventService.server.emit('NEW_VOTE', { user: voteObject.user, totalVote: user.achievement.topggVote })
  }
}
