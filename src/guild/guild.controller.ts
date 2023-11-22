import { Body, Controller, Get, Inject, Logger, Param, Patch, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventGateway } from '../event/event.gateway';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { GuildHasDto } from './dto/guild-has.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { GuildService } from './guild.service';
import { CantSendMessageException } from './guild.exception';
import { BounsbotRequest } from 'src/@types/BounsbotReq';

@Controller('guilds')
@ApiTags('guilds')
export class GuildController {
  private readonly logger = new Logger(GuildController.name);

  constructor(
    private readonly eventService: EventGateway,
    @Inject(CACHE_MANAGER) private cacheManager: CacheStore,

    private readonly guildService: GuildService,
  ) { }

  @Get('/best')
  @ApiOperation({ summary: 'return the best guild' })
  @ApiResponse({
    status: 200,
    description: 'Return the best guild'
  })
  async bestGuild() {
    try {
      let bestGuildObject = await this.cacheManager.get('BEST_GUILD');
      if (bestGuildObject) return bestGuildObject;

      const bestGuild = await this.eventService.server.timeout(1000).emitWithAck('BEST_GUILD')
      const totalGuild = await this.eventService.server.timeout(1000).emitWithAck('FETCH_CLIENT_VALUES', "client.guilds.cache.size")

      let guilds = bestGuild.flat().sort((a, b) => b.memberCount - a.memberCount).slice(0, 10)

      bestGuildObject = { guilds, totalGuild: totalGuild.reduce((a, b) => a + b, 0) }
      this.cacheManager.set('BEST_GUILD', bestGuildObject, { ttl: 600 });

      return bestGuildObject
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
      const shardsResponse = await this.eventService.server.timeout(1000).emitWithAck('GUILD_HAS', guildHas);

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
  async sendMessage(@Req() request: BounsbotRequest, @Body() message: SendMessageDto) {
    message.guildId = `${request.headers.guildid}`

    try {
      const shardsResponse = await this.eventService.server.timeout(1000).emitWithAck('SEND_MESSAGE', message);

      const response = shardsResponse.find((e) => e !== null);

      if (!response) throw new CantSendMessageException()

      return response

    } catch (e) {
      this.logger.error(e)
      throw new CantSendMessageException()
    }
  }

  @Get('/configuration/:guildId')
  @ApiOperation({ summary: 'return the configuration' })
  @ApiResponse({
    status: 200,
    description: 'Return the configuration'
  })
  async configuration(@Param('guildId') guildId: String) {
    try {
      return this.guildService.getConfig(guildId)
    }
    catch (e) {
      this.logger.error(e)
      return [];
    }
  }

  @Patch('/configuration/:guildId')
  @ApiOperation({ summary: 'Update the configuration' })
  @ApiResponse({
    status: 200,
    description: 'Update the configuration'
  })
  async updateConfiguration(@Param('guildId') guildId: String, @Body() configuration: any) {
    return await this.guildService.updateConfiguration(guildId, configuration)
  }

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
}


