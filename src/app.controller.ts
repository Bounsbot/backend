import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { Controller, Get, Inject } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: CacheStore,
  ) {}

  @Get()
  async findAll() {
    const data = await this.cacheManager.get('data');

    if (data) return data;

    await this.cacheManager.set(
      new Date().toISOString(),
      [{ id: 1, name: 'Nest' }],
      { ttl: 100 },
    );

    return [{ id: 1, name: 'Nest' }];
  }
}
