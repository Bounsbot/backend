import { Body, Controller, Get, Header, Headers, Post, Query, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthenticatedGuard, DiscordAuthGuard } from '../utils/Guards';
import { Cookie } from 'express-session';
import { AuthService } from '../services/auth.service';
import { MiddlewareBuilder } from '@nestjs/core';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @Get('guilds')
  async getGuilds(@Headers() headers) {
    console.log("getGuilds", headers);
    const guilds = await this.authService.getGuilds(headers.authorization)

    return guilds;
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
