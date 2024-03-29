import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventGateway } from '../event/event.gateway';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { RetrieveCommandsException } from './commands.exception';

@Controller('commands')
@ApiTags('commands')
export class CommandsController {
  private readonly logger = new Logger(CommandsController.name);

  constructor(
    private readonly eventService: EventGateway,
    @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
  ) { }

  @Get()
  @ApiOperation({ summary: 'Get all commands' })
  @ApiResponse({
    status: 200,
    description: 'Returns the activate commands',
  })
  async allCommands() {
    let commands: Object = await this.cacheManager.get('COMMANDS');

    if (commands) return commands;

    const firstSocket = this.eventService.server.sockets.keys().next().value;
    if (!firstSocket) return [];

    try {
      const response = await this.eventService.server.timeout(20000).to(firstSocket).emitWithAck('COMMANDS');

      commands = response.find((e) => e != null);
      this.cacheManager.set('COMMANDS', commands, { ttl: 10800 });
      return commands;

    } catch (e) {
      this.logger.error(e);
      throw new RetrieveCommandsException();
    }
  }
}
