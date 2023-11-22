import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthGuildPermissionException, AuthUnauthorizedException, GuildIdMissingException } from './auth.exception';
import { EventGateway } from 'src/event/event.gateway';
import { JwtService } from '@nestjs/jwt';
import { BounsbotRequest } from '../@types/BounsbotReq';

@Injectable()
export class AuthGuildAccessMiddleware implements NestMiddleware {
    constructor(
        private eventService: EventGateway,
        private jwtService: JwtService
    ) { }


    async use(req: BounsbotRequest, res: Response, next: NextFunction) {
        try {
            console.log("AuthGuildAccessMiddleware");
            console.log(req.headers);
            const guildId = req.headers.guildid;
            console.log("guildId", guildId);


            console.log("Authorization", req.headers.authorization);
            const token = req.headers.authorization.split(" ")[1];

            const { access_token, refresh_token, token_type, userId } = this.jwtService.verify(token);

            console.log("verified", { access_token, refresh_token, userId });

            req.discordToken = token_type + " " + access_token
            req.userId = userId

            const permission = await this.eventService.server.timeout(1000).emitWithAck('HAS_GUILD_PERM', { guildId: req.headers.guildid, userId: "266636247017979904", permissions: "Administrator" })
            console.log("permission", permission);

            if (!permission) throw new GuildIdMissingException();

            if (!permission.find((hasPerm) => hasPerm == true)) {
                throw new AuthUnauthorizedException();
            }
            else {
                next();
            }
        }
        catch (e) {
            console.log(e);
            throw new AuthUnauthorizedException();
        }
    }
}


@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private eventService: EventGateway,
        private jwtService: JwtService
    ) { }


    async use(req: BounsbotRequest, res: Response, next: NextFunction) {
        try {
            console.log("AuthMiddelware");
            console.log(req.headers);

            console.log("authorisation", req.headers.authorization);
            const token = req.headers.authorization.split(" ")[1];

            console.log("token", token);

            const { access_token, refresh_token, token_type, userId } = this.jwtService.verify(token);

            console.log("verified", { access_token, refresh_token, userId });

            req.discordToken = token_type + " " + access_token
            req.userId = userId

            next();
        }
        catch (e) {
            console.log(e);
            throw new AuthUnauthorizedException();
        }
    }
}
