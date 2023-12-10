import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { AuthUnauthorizedException, GuildIdMissingException } from './auth.exception';
import { EventGateway } from 'src/event/event.gateway';
import { JwtService } from '@nestjs/jwt';
import { BounsbotRequest } from '../@types/BounsbotReq';

@Injectable()
export class AuthGuildAccessMiddleware implements NestMiddleware {
    private readonly logger = new Logger(AuthGuildAccessMiddleware.name);

    constructor(
        private eventService: EventGateway,
        private jwtService: JwtService,
    ) { }


    async use(req: BounsbotRequest, res: Response, next: NextFunction) {
        try {
            const token = req.headers.authorization.split(" ")[1];

            const { access_token, token_type, userId } = this.jwtService.verify(token);

            req.discordToken = token_type + " " + access_token
            req.userId = userId

            const permission = await this.eventService.server.timeout(1000).emitWithAck('HAS_GUILD_PERM', { guildId: req.headers.guildid, userId: "266636247017979904", permissions: "Administrator" })

            if (!permission) throw new GuildIdMissingException();

            if (!permission.find((hasPerm) => hasPerm == true)) {
                throw new AuthUnauthorizedException();
            }
            else {
                next();
            }
        }
        catch (e) {
            this.logger.error(e);
            throw new AuthUnauthorizedException();
        }
    }
}


@Injectable()
export class AuthMiddleware implements NestMiddleware {
    private readonly logger = new Logger(AuthMiddleware.name);

    constructor(
        private jwtService: JwtService,
    ) { }

    async use(req: BounsbotRequest, res: Response, next: NextFunction) {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const { access_token, token_type, userId } = this.jwtService.verify(token);

            req.discordToken = token_type + " " + access_token
            req.userId = userId

            next();
        }
        catch (e) {
            this.logger.error(e);
            throw new AuthUnauthorizedException();
        }
    }
}
