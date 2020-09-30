import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ResponseCommentDTO } from '../models/dto/comments/response-comment.dto';
import { CreateCommentDTO } from 'src/models/dto/comments/create-comment.dto';
import { Users } from 'src/database/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentRepository } from './comments.repository';
import { plainToClass } from 'class-transformer';
import { Posts } from 'src/database/entities/post.entity';
import { PostRepository } from 'src/posts/post.repository';
import { Comments } from 'src/database/entities/comment.entity';
import { UpdateCommentDTO } from 'src/models/dto/comments/update-comment.dto';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(CommentRepository)
        private readonly commentRepository: CommentRepository,
        @InjectRepository(PostRepository)
        private readonly postRepository: PostRepository
        ) {}


        public async createComment(comment: CreateCommentDTO, user: Users, postId: string): Promise<ResponseCommentDTO> {
            if (user.isDeleted) {
                throw new ForbiddenException(`Forbidden action`);
            }
            const commentPost: Posts = await this.postRepository.viewPostById(postId);
            if (commentPost.isLocked && !user.role.includes('admin')) {
                throw new BadRequestException(`Post has been locked by Admin`);
            }
            const { content }: Partial<Comments> = comment;
            const commentCreation: Comments = this.commentRepository.create(comment);

            commentCreation.content = content;
            commentCreation.post = Promise.resolve(commentPost);
            commentCreation.author = Promise.resolve(user);
            commentCreation.editor = user.username;

            const commentCreated: Comments = await this.commentRepository.save(commentCreation);

            return plainToClass(
                ResponseCommentDTO,
                { ...commentCreated, author: user.username },
                { excludeExtraneousValues: true }
                );
        };
        public async updateComment(id: string, user: Users, updateComment: UpdateCommentDTO, postId: string): Promise<ResponseCommentDTO> {
            if (user.isDeleted) {
                throw new ForbiddenException(`Forbidden action`);
            }
            const { content }: Partial<Comments> = updateComment;
            const post: Posts = await this.postRepository.viewPostById(postId);
            if (post.isLocked && !user.role.includes('admin')) {
                throw new BadRequestException(`Post has been locked by Admin`);
            }
            const commentToUpdate: Comments = await this.commentRepository.viewCommentById(id);
            const commentCreator: Users = await commentToUpdate.author;

            if (commentCreator.id !== user.id && !user.role.includes('admin')) {
                 throw new BadRequestException(`This comment is not published by your account`);
            }
            if (content) { 
                commentToUpdate.content = content;
            }
            commentToUpdate.editor = user.username;
  
            const updatedComment: Comments = await this.commentRepository.save(commentToUpdate);
            
            return plainToClass(
                ResponseCommentDTO,
                { ...updatedComment },
                { excludeExtraneousValues: true }
                );
        }
        public async deleteComment(id: string, user: Users, postId: string): Promise<string> {
            if (user.isDeleted) {
                throw new ForbiddenException(`Forbidden action`);
            }
            const commentToDelete: Comments = await this.commentRepository.viewCommentById(id);
            const commentCreator: Users = await commentToDelete.author;
            const post: Posts = await this.postRepository.viewPostById(postId);

            if (post.isLocked && !user.role.includes('admin')) {
                throw new BadRequestException(`Post has been locked by Admin`);
            }

            if (commentCreator.id !== user.id && !user.role.includes('admin')) {
                 throw new BadRequestException(`This comment is not published by your account`);
            }
            commentToDelete.isDeleted = true;
            
            await this.commentRepository.save(commentToDelete);
    
            return  `Comment deleted!`;
        }

        public async viewPostComments(postId: string): Promise<ResponseCommentDTO[]> {
            const post: Posts = await this.postRepository.viewPostById(postId);

            const postCommments: Comments[] = await this.commentRepository.find({
                where: { post, isDeleted: false }
            });
            const listComments: ResponseCommentDTO[] = await Promise.all(postCommments.map(async (comment) => {
            const author: Users = await comment.author;
               return { ...comment, author: author.username }
            }
            ));
            return plainToClass(ResponseCommentDTO, listComments, { excludeExtraneousValues: true });
        }
}
