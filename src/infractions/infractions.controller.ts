import { Controller, DefaultValuePipe, Get, Inject, Param, ParseIntPipe, Query, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventGateway } from '../event/event.gateway';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { Infractions } from './schemas/Infractions.schema';
import { InfractionsService } from './infractions.service';
import { GuildService } from '../guild/guild.service';
import { InfractionStatsDto } from './dto/infraction-stats.dto';
import { BounsbotRequest } from 'src/@types/BounsbotReq';
import { ModeratorStatsDto } from './dto/moderator-stats.dto';

@Controller('infractions')
@ApiTags('infractions')
export class InfractionsController {
  constructor(
    private readonly infractionsService: InfractionsService,
  ) { }

  @Get("/stats")
  @ApiOperation({ summary: 'Get infractions stats' })
  @ApiResponse({
    status: 200,
    description: 'Returns stats about infractions',
  })
  async getInfractionsStats(@Req() request: BounsbotRequest): Promise<InfractionStatsDto> {
    return await this.infractionsService.generateInfractionStats(`${request.headers.guildid}`)
  }

  @Get("/modstats")
  @ApiOperation({ summary: 'Get Infractions stats for moderator' })
  @ApiResponse({
    status: 200,
    description: 'Returns stats about infractions for moderator',
  })
  async getModeratorStats(@Req() request: BounsbotRequest): Promise<ModeratorStatsDto[]> {
    return await this.infractionsService.generateModeratorStats(`${request.headers.guildid}`)
  }

  @Get("/list")
  @ApiOperation({ summary: 'Get infractions list' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of infractions',
  })
  async getInfractions(@Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number, @Query("limit", new DefaultValuePipe(100), ParseIntPipe) limit: number, @Req() request: BounsbotRequest): Promise<Infractions[]> {
    return await this.infractionsService.findInfractionsWithPagination(page, limit, `${request.headers.guildid}`)
  }
}
