import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OAuth2Credentials } from 'src/typeorm/entities/OAuth2Credentials.entity';
import { User } from 'src/typeorm/entities/User.entity';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { DiscordStrategy } from './utils/DiscordStrategy';

@Module({
  imports: [TypeOrmModule.forFeature([User, OAuth2Credentials])],
  controllers: [AuthController],
  providers: [
    DiscordStrategy,
  ],
})
export class AuthModule {}
