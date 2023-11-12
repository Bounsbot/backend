// import { User } from 'src/typeorm/entities/User.entity';

export type UserDetails = {
  identifiant: string;
  username: string;
  picture: string;
  email: string;
};

export type Oauth2 = {
  identifiant: string;
  username: string;
  picture: string;
  email: string;
};


export type OAuth2Details = {
  discordId: string;
  accessToken: string;
  refreshToken: string;
};

export type AccessTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string
};

export type FindOAuth2Params = Partial<{
  discordId: string;
  accessToken: string;
  refreshToken: string;
}>;

export type Done = (err: Error, user: any) => void;
