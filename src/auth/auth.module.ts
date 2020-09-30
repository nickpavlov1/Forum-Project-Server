import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../users/user.repository';
import { JwtModule } from '@nestjs/jwt'
import { ConfigService, ConfigModule, } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UsersModule } from '../users/user.module'


@Module({
  imports: [
    UserRepository,
    TypeOrmModule.forFeature([UserRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secretOrPrivateKey: configService.get('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: +configService.get('JWT_EXPIRE_TIME'),
        },
    }),
  }),
    ],
  providers: [
    UsersModule,
    ConfigService,
    ConfigModule,
    AuthService,
    JwtStrategy
  ],
  controllers: [AuthController],
  exports: [
    AuthService,
     JwtStrategy,
    PassportModule
  ],
})
export class AuthModule {}
