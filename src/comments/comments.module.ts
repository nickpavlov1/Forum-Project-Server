import { Module } from '@nestjs/common';
import { CommentRepository } from './comments.repository';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsController } from './comments.controller';
import { PostRepository } from 'src/posts/post.repository';
import { AuthModule } from 'src/auth/auth.module';
import { AdminModule } from 'src/admin/admin.module';


@Module({
  imports: [
    AdminModule,
    PostRepository,
    CommentRepository,
    AuthModule,
    TypeOrmModule.forFeature([CommentRepository, PostRepository])
  ],
  providers: [
    CommentsService
    ],
  controllers: [CommentsController],
  exports: [CommentRepository]
})
export class CommentsModule {}
