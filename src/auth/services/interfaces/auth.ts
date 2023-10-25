// import { User } from 'src/typeorm/entities/User.entity';
import {
  FindOAuth2Params,
  FindUserParams,
  OAuth2Details,
  UserDetails,
} from '../../utils/types';

export interface IAuthService {
  validateUser(datails: UserDetails): Promise<any>;
  createUser(details: UserDetails): Promise<any>;
  updateUser(details: UserDetails): Promise<any>;
  findUser(params: FindUserParams): Promise<any>;
  validateOAuth2(details: OAuth2Details): Promise<OAuth2Details>;
  createOAuth2(details: OAuth2Details): Promise<OAuth2Details>;
  updateOAuth2(details: OAuth2Details): Promise<OAuth2Details>;
  findOAuth2(params: FindOAuth2Params): Promise<OAuth2Details>;
}
