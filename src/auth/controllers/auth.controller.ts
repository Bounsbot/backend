import { Controller, Get, Logger, Post, Query, Req } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { EventGateway } from 'src/event/event.gateway';
import { JwtService } from '@nestjs/jwt';
import { BounsbotRequest } from 'src/@types/BounsbotReq';
import { invalidTokenException } from '../auth.exception';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly eventService: EventGateway,
    private readonly jwtService: JwtService,
  ) { }

  @Get('guilds')
  async getGuilds(@Req() request: BounsbotRequest) {
    try {
      const guilds = await this.authService.getGuilds(request.discordToken)

      let guildAdmin = await guilds.filter(guild => guild.permissions === 2147483647)
      let hasGuilds = []

      try {
        const shardsResponse = await this.eventService.server.timeout(3000).emitWithAck('GUILD_HAS', { has: guildAdmin.map(e => e.id) });
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
      message: "Code is missing",
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
      this.logger.error("AUTH login error", e);
      return {
        success: false,
        message: "Error invalid code",
        data: {}
      }
    }
  }

  @Post('logout')
  logout(@Req() request: BounsbotRequest) {

    const token = request.headers.authorization.split(" ")[1];

    const { access_token, refresh_token, token_type, userId } = this.jwtService.verify(token);

    return this.authService.removeToken(access_token);
  }
}
