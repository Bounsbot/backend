import { Controller, DefaultValuePipe, Get, Inject, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventGateway } from '../event/event.gateway';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { GlobalLevel } from './schemas/globalLevel.schema';
import { LevelsService } from './levels.service';
import { GuildService } from '../guild/guild.service';

@Controller('levels')
@ApiTags('levels')
export class LevelsController {
  constructor(
    private readonly eventService: EventGateway,
    private readonly levelsService: LevelsService,
    private readonly guildService: GuildService,
  ) { }

  @Get("/global")
  @ApiOperation({ summary: 'Get global levels' })
  @ApiResponse({
    status: 200,
    description: 'Returns the global levels',
  })
  async getGlobalLevels(@Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number, @Query("limit", new DefaultValuePipe(100), ParseIntPipe) limit: number): Promise<GlobalLevel[]> {
    return this.levelsService.findGlobalLevelWithPagination(page, limit)
  }

  @Get("/guild/:id")
  @ApiOperation({ summary: 'Get guild levels' })
  @ApiResponse({
    status: 200,
    description: 'Returns the guild levels',
  })
  async locateGuildInShard(@Param('id') id: string, @Query("page", new DefaultValuePipe(0), ParseIntPipe) page: number = 0, @Query("limit", new DefaultValuePipe(100), ParseIntPipe) limit: number = 100) {
    let rank = await this.levelsService.findGuildLevelWithPagination(id, page, limit)
    let configuration = await this.guildService.getRoleLevelConfiguration(id)
    let levelsRole = await this.guildService.checkLevelRoles(id, configuration)

    return {
      rank,
      configuration,
      levelsRole

    }
  }
}
