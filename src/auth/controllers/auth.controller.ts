import { Controller, Get, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../services/auth.service';
import { EventGateway } from 'src/event/event.gateway';
import { JwtService } from '@nestjs/jwt';
import { BounsbotRequest } from 'src/@types/BounsbotReq';
import { invalidTokenException } from '../auth.exception';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly eventService: EventGateway,
    private readonly jwtService: JwtService
  ) { }

  @Get('guilds')
  async getGuilds(@Req() request: BounsbotRequest) {
    console.log("BounsbotRequest", request);
    console.log("BounsbotRequest", request.discordToken);


    try {
      const guilds = await this.authService.getGuilds(request.discordToken)

      console.log("guilds", guilds);

      let guildAdmin = await guilds.filter(guild => guild.permissions === 2147483647)
      let hasGuilds = []

      try {
        const shardsResponse = await this.eventService.server.timeout(1000).emitWithAck('GUILD_HAS', { has: guildAdmin.map(e => e.id) });
        hasGuilds = shardsResponse.flat()

        for (let guild of guildAdmin) {
          guild.bot = hasGuilds.find((e) => e == guild.id) ? true : false
        }

      } catch (e) {
        return [];
      }

      guildAdmin.sort((a, b) => (a.bot === b.bot) ? 0 : a.bot ? -1 : 1)

      return guildAdmin;
    }
    catch (e) {
      throw new invalidTokenException();
    }
  }

  @Get('user')
  async getUser(@Req() request: BounsbotRequest) {
    const user = await this.authService.getUser(request.discordToken)

    return user;
  }

  @Get('login')
  async login(@Query('code') code: string) {

    if (!code) return {
      success: false,
      message: "No code",
      data: {}
    }

    try {
      const tokenResponseData = await this.authService.getTokens(code);

      const userResult = await this.authService.getUser(`${tokenResponseData?.token_type} ${tokenResponseData?.access_token}`)

      this.authService.validateOAuth2({
        discordId: userResult.id,
        accessToken: tokenResponseData.access_token,
        refreshToken: tokenResponseData.refresh_token,
      });

      return {
        success: true,
        message: "Logged in",
        data: {
          tokenType: tokenResponseData?.token_type,
          token: this.jwtService.sign({
            token_type: tokenResponseData?.token_type,
            access_token: tokenResponseData?.access_token,
            refresh_token: tokenResponseData?.refresh_token,
            userId: userResult.id,
          }),
          user: userResult
        }
      }

    }
    catch (e) {
      console.error("AUTH login error", e);
      return {
        success: false,
        message: "Error invalid code",
        data: {}
      }
    }
  }

  @Get('status')
  status(@Req() req: Request) {
    console.log("status", req);
    return req;
  }

  @Post('logout')
  logout(@Req() request: BounsbotRequest) {

    const token = request.headers.authorization.split(" ")[1];

    const { access_token, refresh_token, token_type, userId } = this.jwtService.verify(token);

    console.log("verified", { access_token, refresh_token, userId });

    return this.authService.removeToken(access_token);
  }
}
