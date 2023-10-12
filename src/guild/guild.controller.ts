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

      let channels = shardsResponse.find((e) => e !== null);
      if(!channels) return null

      return channels
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

  @Post('/:guildId/send')
  @ApiOperation({ summary: 'Send message to a specific guildChannel' })
  @ApiResponse({
    status: 200,
    description: 'Send message to a specific guildChannel' 
  })
  async sendMessage(@Body() message: SendMessageDto) {
    try {
      const shardsResponse = await this.eventService.server.timeout(1000).emitWithAck('SEND_MESSAGE', message);

      const success = shardsResponse.find((e) => e !== null);
      return { 
        success: success || false,
      }
    } catch (e) {
      this.logger.error(e)
      return [];
    }  
  }


}
