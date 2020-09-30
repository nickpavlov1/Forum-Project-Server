import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { BanRepository } from '../admin/ban-status.repository';
import { BanStatus } from '../database/entities/ban.entity';

@Module({
    imports: [
        UserRepository,
        TypeOrmModule.forFeature([UserRepository, BanRepository, BanStatus]),
    ],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserRepository]
})
export class UsersModule {}
