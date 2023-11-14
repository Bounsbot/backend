import { Body, Controller, Get, Header, Headers, Post, Query, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthenticatedGuard, DiscordAuthGuard } from '../utils/Guards';
import { Cookie } from 'express-session';
import { AuthService } from '../services/auth.service';
import { MiddlewareBuilder } from '@nestjs/core';
import { EventGateway } from 'src/event/event.gateway';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly eventService: EventGateway,
  ) { }

  @Get('guilds')
  async getGuilds(@Headers() headers) {
    const guilds = await this.authService.getGuilds(headers.authorization)

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

  @Get('user')
  async getUser(@Headers() headers) {
    console.log("getUser", headers);
    const user = await this.authService.getUser(headers.authorization)

    return user;
  }

  @Get('login')
  async login(@Query('code') code: string) {
    console.log("Code exchange", code);

    if (!code) return {
      success: false,
      message: "No code",
      data: {}
    }

    try {
      const tokenResponseData = await this.authService.getTokens(code);
      console.log(tokenResponseData);

      const userResult = await this.authService.getUser(`${tokenResponseData?.token_type} ${tokenResponseData?.access_token}`)
      console.log(userResult);

      return {
        success: true,
        message: "Logged in",
        data: {
          tokenType: tokenResponseData?.token_type,
          token: tokenResponseData?.access_token,
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
  // @UseGuards(AuthenticatedGuard)
  status(@Req() req: Request) {
    console.log("status", req);
    return req;
  }

  @Post('logout')
  logout() {
    return {};
  }
}
