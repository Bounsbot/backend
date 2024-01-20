import { MiddlewareConsumer, Module } from '@nestjs/common';
import { InfractionsController } from './infractions.controller';
import { EventModule } from '../event/event.module';
import { InfractionsSchema } from './schemas/Infractions.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { InfractionsService } from './infractions.service';
import { AuthGuildAccessMiddleware } from 'src/auth/auth.middlewars';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    EventModule,
    MongooseModule.forFeature([
      { name: 'Infractions', schema: InfractionsSchema },
    ]),
    JwtModule.register({
      secret: process.env.SECRET_JWT,
      signOptions: { expiresIn: '600000s' },
    }),
  ],
  controllers: [InfractionsController],
  providers: [InfractionsService],
})
export class InfractionsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthGuildAccessMiddleware)
      .forRoutes('infractions');
  }
}
