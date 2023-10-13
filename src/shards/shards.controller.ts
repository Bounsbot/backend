import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventGateway } from '../event/event.gateway';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';

@Controller('shards')
@ApiTags('shards')
export class ShardsController {
  constructor(
    private readonly eventService: EventGateway,
    @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
  ) { }

  @Get()
  @ApiOperation({ summary: 'Get shards information' })
  @ApiResponse({
    status: 200,
    description: 'Returns the shards information',
  })
  async getShardsInformation() {
    let shardsInfo: Array<any> = await this.cacheManager.get('SHARDS_INFO');
    if (shardsInfo) return shardsInfo;

    try {
      shardsInfo = await this.eventService.server.timeout(1000).emitWithAck('SHARDS_INFO');
      shardsInfo = shardsInfo.sort((a, b) => a.cluster_id - b.cluster_id);
      this.cacheManager.set('SHARDS_INFO', shardsInfo, { ttl: 60 });
      return shardsInfo;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  @Get("/search/:id")
  @ApiOperation({ summary: 'Locate Guild in shards' })
  @ApiResponse({
    status: 200,
    description: 'Returns the shard id where the guild is located',
  })
  async locateGuildInShard(@Param('id') id: string) {
    try {
      const getInfo = await this.eventService.server.timeout(1000).emitWithAck('FETCH_CLIENT_VALUES', "guilds.cache.has('" + id + "') ? process.env.SHARDS_ID : null");
      const located = getInfo.find((e) => e !== null);
      return { shard: located || null }
    } catch (e) {
      console.error(e);
      return { shard: null }
    }
  }
}
