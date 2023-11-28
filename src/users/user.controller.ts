import { Body, Controller, Get, Logger } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventGateway } from '../event/event.gateway';
import { VoteDto } from './dto/vote.dto';
import { VoteObjectException } from './user.exception';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly eventService: EventGateway,
    private readonly userService: UserService
  ) { }

  @Get('/vote')
  @ApiOperation({ summary: 'Add vote to user' })
  @ApiResponse({
    status: 200,
    description: 'Add vote to user'
  })
  async vote(@Body() voteObject: VoteDto) {
    if (voteObject.type != "upvote") throw new VoteObjectException();

    await this.userService.updateTopGGVote(voteObject)
    return { success: true }
  }
}


