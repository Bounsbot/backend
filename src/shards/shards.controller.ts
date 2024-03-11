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

    shardsInfo = Array.from({ length: this.eventService.shardsCount }, (e, i) => ({ cluster_id: i, status: -1 }));

    const promises = Array.from(this.eventService.server.sockets.keys()).map(async (socket) => {
      const response = await this.eventService.server.to(socket).timeout(20000).emitWithAck('SHARDS_INFO')
      return response
    });

    const results = await Promise.allSettled(promises);

    for (let res of results) {
      if (res.status === 'fulfilled') {
        const response = res.value[0];
        shardsInfo[response.cluster_id as number] = response;
      }
    }

    if (!shardsInfo.every(e => e.status === -1)) {
      this.cacheManager.set('SHARDS_INFO', shardsInfo, { ttl: 20 });
    }

    return shardsInfo;
  }

  @Get("/search/:id")
  @ApiOperation({ summary: 'Locate Guild in shards' })
  @ApiResponse({
    status: 200,
    description: 'Returns the shard id where the guild is located',
  })
  async locateGuildInShard(@Param('id') id: string) {
    try {
      const getInfo = await this.eventService.server.timeout(20000).emitWithAck('FETCH_CLIENT_VALUES', "client.guilds.cache.has('" + id + "') ? process.env.SHARDS_ID : null");
      const located = getInfo.find((e) => e !== null);
      return { shard: located || null }
    } catch (e) {
      console.error(e);
      return { shard: null }
    }
  }
}
