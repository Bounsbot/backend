import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { EventModule } from 'src/event/event.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { AuthMiddleware } from 'src/auth/auth.middlewars';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [EventModule,
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema }
    ]),
    JwtModule.register({
      secret: process.env.SECRET_JWT,
      signOptions: { expiresIn: '600000s' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'user/vote', method: RequestMethod.POST },
      )
      .forRoutes('user');
  }
}
