import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { OAuth2Credentials } from 'src/typeorm/entities/OAuth2Credentials.entity';
// import { User } from 'src/typeorm/entities/User.entity';
import { AuthController } from './controllers/auth.controller';
// import { AuthService } from './services/auth.service';
// import { DiscordStrategy } from './utils/DiscordStrategy';
import { SessionSerializer } from './utils/SessionSerializer';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/users/schemas/user.schema';
import { AuthSchema } from './schema/auth.schema';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Auth', schema: AuthSchema }
    ]),
  ],
  controllers: [AuthController],
  providers: [
    // DiscordStrategy,
    AuthService,
    SessionSerializer,
    // {
    //   provide: 'AUTH_SERVICE',
    //   useClass: AuthService,
    // },
  ],
})
export class AuthModule { }
