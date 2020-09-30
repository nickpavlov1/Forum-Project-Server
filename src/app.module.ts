import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import * as Joi from '@hapi/joi';
import { UsersModule } from './users/user.module';
import { PostsModule } from './posts/post.module';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { AdminModule } from './admin/admin.module';
import { VotesModule } from './votes/votes.module';



@Module({
  imports: [
    AdminModule,
    CommentsModule,
    AuthModule,
    PostsModule,
    UsersModule,
    DatabaseModule,
    VotesModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        DB_TYPE: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE_NAME: Joi.string().required(),
      }),
    }),
  ],
})

export class AppModule {}
