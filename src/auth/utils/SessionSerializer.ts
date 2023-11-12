import { Inject } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { IAuthService } from '../services/interfaces/auth';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth, AuthDocument } from '../schema/auth.schema';

export class SessionSerializer extends PassportSerializer {
    constructor(
        // @Inject('AUTH_SERVICE') private readonly authService: IAuthService,

        @InjectModel(User.name)
        private user: Model<UserDocument>,

        // @InjectModel(Auth.name)
        // private auth: Model<AuthDocument>,
    ) {
        super();
    }
    serializeUser(user: User, done: (err: Error, user: User) => void) {
        console.log("serializeUser", user);
        done(null, user);
    }
    async deserializeUser(user: User, done: (err: Error, user: User) => void) {
        console.log("deserializeUser", user);
        const userDB = await this.user.findOne({
            identifiant: user.identifiant,
        });
        return userDB ? done(null, userDB) : done(null, null);
    }
}
