import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/users/schemas/user.schema';
import { AuthSchema } from './schema/auth.schema';
import { AuthService } from './services/auth.service';
import { EventModule } from 'src/event/event.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Auth', schema: AuthSchema }
    ]),
    EventModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
  ],
})
export class AuthModule { }
