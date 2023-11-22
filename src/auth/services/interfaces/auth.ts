// import { User } from 'src/typeorm/entities/User.entity';
import { User } from 'src/users/schemas/user.schema';
import {
  OAuth2Details,
  UserDetails,
} from '../../utils/types';
import { Auth } from 'src/auth/schema/auth.schema';

export interface IAuthService {
  validateUser(details: UserDetails): Promise<User>;
  createUser(details: UserDetails): Promise<User>;
  updateUser(details: UserDetails): Promise<User>;
  validateOAuth2(details: OAuth2Details): Promise<Auth>;
  createOAuth2(details: OAuth2Details): Promise<Auth>;
  updateOAuth2(details: OAuth2Details): Promise<Auth>;
}
