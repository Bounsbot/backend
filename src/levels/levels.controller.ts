import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventGateway } from '../event/event.gateway';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { GlobalLevel } from './schemas/globalLevel.schema';
import { LevelsService } from './levels.service';

@Controller('levels')
@ApiTags('levels')
export class LevelsController {
  constructor(
    private readonly eventService: EventGateway,
    @Inject(CACHE_MANAGER) private cacheManager: CacheStore,

    private readonly levelsService: LevelsService
  ) { }

  @Get("/global/:page")
  @ApiOperation({ summary: 'Get global levels' })
  @ApiResponse({
    status: 200,
    description: 'Returns the global levels',
  })
  async getGlobalLevels(@Param('page') page: number, @Query("limit") limit: number = 100): Promise<GlobalLevel[]> {
    return this.levelsService.findGlobalLevelWithPagination(page, limit)
  }

  @Get("/guild/:id/:page")
  @ApiOperation({ summary: 'Get guild levels' })
  @ApiResponse({
    status: 200,
    description: 'Returns the guild levels',
  })
  async locateGuildInShard(@Param('id') id: string, @Param("page") page: number, @Query("limit") limit: number = 100) {
    
  }
}
