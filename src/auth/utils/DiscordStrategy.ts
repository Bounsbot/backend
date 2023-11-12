import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-discord';
import { Done } from './types';
import { IAuthService } from '../services/interfaces/auth';
import { encrypt } from './encrypt';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: IAuthService,
  ) {
    super({
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: process.env.DISCORD_REDIRECT_URI,
      scope: ['identify', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: Done,
  ) {
    const encryptedAccessToken = encrypt(accessToken).toString();
    const encryptedRefreshToken = encrypt(refreshToken).toString();
    const { id: discordId, email, discriminator, username, avatar } = profile;
    const user = await this.authService.validateUser({
      identifiant: discordId,
      email,
      username,
      picture: `https://cdn.discordapp.com/avatars/${discordId}/${avatar}.webp`
    });

    await this.authService.validateOAuth2({
      discordId,
      accessToken: encryptedAccessToken,
      refreshToken: encryptedRefreshToken,
    });
    done(null, user);
  }
}