import { Body, Controller, Get, Header, Logger, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventGateway } from '../event/event.gateway';
import { VoteDto } from './dto/vote.dto';
import { VoteCredentialDoesntMatchException, VoteObjectException } from './user.exception';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly eventService: EventGateway,
    private readonly userService: UserService
  ) { }

  @Post('/vote')
  @ApiOperation({ summary: 'Add vote to user' })
  @ApiResponse({
    status: 200,
    description: 'Add vote to user'
  })
  async vote(@Body() voteObject: VoteDto, @Req() req: any) {
    this.logger.log(`Vote received from ${req.headers['x-forwarded-for'] || req.connection.remoteAddress} with ${JSON.stringify(voteObject)}`)
    if (!process.env.TOPGG_CREDENTIAL || req.headers.authorization !== process.env.TOPGG_CREDENTIAL) throw new VoteCredentialDoesntMatchException();
    if (voteObject.type != "upvote") throw new VoteObjectException();

    await this.userService.updateTopGGVote(voteObject)
    return { success: true }
  }
}


