import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/users/schemas/user.schema';
import { AuthSchema } from './schema/auth.schema';
import { AuthService } from './services/auth.service';
import { EventModule } from 'src/event/event.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthMiddleware } from './auth.middlewars';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Auth', schema: AuthSchema }
    ]),
    EventModule,
    JwtModule.register({
      secret: process.env.SECRET_JWT,
      signOptions: { expiresIn: '600000s' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
  ],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.ALL },
        { path: 'auth/status', method: RequestMethod.ALL },
        { path: 'auth/logout', method: RequestMethod.ALL },
      )
      .forRoutes('auth');
  }
}
