import { Body, Controller, Get, Inject, Logger, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventGateway } from '../event/event.gateway';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { GuildHasDto } from './dto/guild-has.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('guilds')
@ApiTags('guilds')
export class GuildController {
  private readonly logger = new Logger(GuildController.name);

  constructor(
    private readonly eventService: EventGateway,
  ) { }

  @Get("/:guildId/:type")
  @ApiOperation({ summary: 'Get guild channel' })
  @ApiResponse({
    status: 200,
    description: 'Returns the guild channel'
  })
  async getGuildElement(@Param("guildId") guildId: String, @Param('type') type: String) {
    try {
      const shardsResponse = await this.eventService.server.timeout(1000).emitWithAck('GUILD_INFO', {
        guildId,
        type
      })

      let elements = shardsResponse.find((e) => e !== null);
      if (!elements) return null

      return elements
    } catch (e) {
      this.logger.error(e)
      return [];
    }
  }

  @Post('/has')
  @ApiOperation({ summary: 'return array guild where bot is' })
  @ApiResponse({
    status: 200,
    description: 'Returns only guild where bot is'
  })
  async hasGuild(@Body() guildHas: GuildHasDto) {
    try {
      const shardsResponse = await this.eventService.server.timeout(1000).emitWithAck('GUILD_HAS', {
        has: guildHas
      });

      return shardsResponse.flat()
    } catch (e) {
      this.logger.error(e)
      return [];
    }
  }

  @Post('/send')
  @ApiOperation({ summary: 'Send message to a specific guildChannel' })
  @ApiResponse({
    status: 200,
    description: 'Send message to a specific guildChannel'
  })
  async sendMessage(@Body() message: SendMessageDto) {
    try {
      const shardsResponse = await this.eventService.server.timeout(1000).emitWithAck('SEND_MESSAGE', message);

      return shardsResponse.find((e) => e !== null) || {
        success: false,
        message: "Bouns'bot n'a pas pu envoyé le message"
      }
    } catch (e) {
      this.logger.error(e)
      return {
        success: false,
        message: "Bouns'bot n'a pas pu envoyé le message"
      }
    }
  }

  @Get('/best')
  @ApiOperation({ summary: 'return the best guild' })
  @ApiResponse({
    status: 200,
    description: 'Return the best guild'
  })
  async bestGuild(@Body() guildHas: GuildHasDto) {
    try {
      const bestGuild = await this.eventService.server.timeout(1000).emitWithAck('BEST_GUILD')

      let top10 = bestGuild.flat().sort((a, b) => b.memberCount - a.memberCount).slice(0, 10)

      return top10
    } catch (e) {
      this.logger.error(e)
      return [];
    }
  }


}
