import { Module } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostRepository } from '../posts/post.repository';
import { CommentRepository } from 'src/comments/comments.repository';
import { AuthModule } from 'src/auth/auth.module';
import { Votes } from 'src/database/entities/vote.entity';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [
    AdminModule,
    PostRepository,
    CommentRepository,
    AuthModule,
    TypeOrmModule.forFeature([Votes, PostRepository, CommentRepository])
  ],
  providers: [VotesService],
  controllers: [VotesController],
  exports: [VotesService]
})
export class VotesModule {

}
