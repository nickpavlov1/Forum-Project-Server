import { Module } from '@nestjs/common';
import { PostsService } from './post.service';
import { PostsController } from './post.controller';
import { PostRepository } from './post.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AdminModule } from 'src/admin/admin.module';


@Module({
  imports: [
    AdminModule,
    TypeOrmModule.forFeature([PostRepository]),
    AuthModule,
    PostRepository,
  ],
  providers: [PostsService],
  controllers: [PostsController],
  exports: [PostRepository]
})
export class PostsModule {}
