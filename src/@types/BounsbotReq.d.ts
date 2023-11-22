import { Request } from 'express';
import { User } from '../user/schemas/user.schema';

export interface BounsbotRequest extends Request {
    discordToken?: string;
    userId?: string;
}
