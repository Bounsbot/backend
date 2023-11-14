import { Injectable } from '@nestjs/common';
import {
  AccessTokenResponse,
  FindOAuth2Params,
  OAuth2Details,
  UserDetails,
} from '../utils/types';
import { IAuthService } from './interfaces/auth';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDocument } from '../schema/auth.schema';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectModel(User.name)
    private user: Model<UserDocument>,

    @InjectModel(Auth.name)
    private auth: Model<AuthDocument>,
  ) { }

  async getUser(token: string) {
    const user = await fetch('https://discord.com/api/users/@me', {
      headers: {
        authorization: token,
      },
    }).then(r => r.json());

    this.validateUser({
      identifiant: user.id,
      username: user.username,
      picture: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`,
      email: user.email,
    });

    return user;
  }

  async getTokens(code: string): Promise<AccessTokenResponse> {
    const token = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.DISCORD_REDIRECT_URI,
      }).toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then(r => r.json());

    return token;
  }

  async refreshTokens(refreshToken: string) {
    const token = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
        redirect_uri: process.env.DISCORD_REDIRECT_URI,
      }).toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then(r => r.json());

    return token;
  }

  async getGuilds(token: string) {
    const guilds = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: {
        authorization: token,
      },
    }).then(r => r.json());

    return guilds;
  }

  async validateUser(details: UserDetails) {
    const { identifiant } = details;
    const user = await this.user.findOne({ identifiant });
    console.log("validateUser", user);
    return (user ? this.updateUser(details) : this.createUser(details));
  }

  createUser(details: UserDetails) {
    console.log("createUser", details);
    const userElement = new this.user(details);
    return userElement.save();
  }

  async updateUser(details: UserDetails) {
    console.log("updateUser");
    await this.user.updateOne({ identifiant: details.identifiant }, { username: details.username, picture: details.picture, email: details.email })
    return this.user.findOne({ identifiant: details.identifiant });
  }

  async validateOAuth2(details: OAuth2Details) {
    const { discordId } = details;
    const oauth2 = await this.auth.findOne({ discordId });
    return oauth2 ? this.updateOAuth2(details) : this.createOAuth2(details);
  }

  createOAuth2(details: OAuth2Details) {
    const oauth2Element = new this.auth(details);
    return oauth2Element.save();
  }

  async updateOAuth2(details: OAuth2Details) {
    return await this.auth.updateOne({ discordId: details.discordId }, { ...details }).then(() => {
      return this.auth.findOne({ discordId: details.discordId });
    });
  }
}
