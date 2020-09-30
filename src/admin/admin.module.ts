import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { BanRepository } from './ban-status.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../users/user.repository';
import { PostRepository } from '../posts/post.repository';
import { CommentRepository } from '../comments/comments.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    BanRepository,
    AuthModule,
    UserRepository,
    PostRepository,
    CommentRepository,
    TypeOrmModule.forFeature([
      BanRepository,
      UserRepository,
      PostRepository,
      CommentRepository
    ]),
  ],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [AdminService]
})
export class AdminModule {}
