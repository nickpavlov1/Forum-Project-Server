import { PostRepository } from './post.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from '../database/entities/post.entity';
import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { CreatePostDTO } from '../models/dto/posts/create-posts.dto';
import { UpdatePostDTO } from '../models/dto/posts/update-posts.dto';
import { ResponsePostDTO } from '../models/dto/posts/response-posts.dto';
import { plainToClass } from 'class-transformer';
import { Users } from 'src/database/entities/user.entity';

@Injectable()
export class PostsService {
    constructor(
    @InjectRepository(PostRepository)
    private readonly postRepository: PostRepository
    ) {}
    public async viewAllPosts(): Promise<Posts[]> {
        const posts: Posts[] = await this.postRepository.find({ where: { isDeleted: false } });
        return posts;
    }

    public async viewPostById(id: string): Promise<Posts> {
        return this.postRepository.viewPostById(id);
    }

    public async createPost(createPostDTO: CreatePostDTO, user: Users): Promise<ResponsePostDTO> {
        if (user.isDeleted) {
            throw new ForbiddenException(`Forbidden action`)
        }
        const { title, content }: Partial<Posts> = createPostDTO;
        const postCreation: Posts = new Posts();
            if (title) {
                postCreation.title = title;
            }
            if (content) {
                postCreation.content = content;
            }
            if (user) {
                postCreation.author = Promise.resolve(user);
            }
            postCreation.editor = user.username;

        const postCreated: Posts = await this.postRepository.save(postCreation);

        return plainToClass(
            ResponsePostDTO,
            {...postCreated, author: user.username },
            { excludeExtraneousValues: true }
            );
    }
    public async deletePost(id: string, user: Users): Promise<void> {
        
        if (user.isDeleted) {
            throw new ForbiddenException(`Forbidden action`);
        }
        const postToDelete: Posts = await this.postRepository.viewPostById(id);

        if (postToDelete.isLocked && !user.role.includes('admin')) {
            throw new BadRequestException(`Post has been locked by Admin`);
        }
        const postCreator: Users = await postToDelete.author;

        if (postCreator.id !== user.id && !user.role.includes('admin')) {
            throw new BadRequestException(`This post is not published by your account`);
        }
        postToDelete.isDeleted = true;
        await this.postRepository.save(postToDelete);
    }

    public async updatePost(id: string, updatePostDTO: UpdatePostDTO, user: Users): Promise<ResponsePostDTO> {
        if (user.isDeleted) {
            throw new ForbiddenException(`Forbidden action`);
        }
        const { title, content }: Partial<Posts> = updatePostDTO;
        const postToUpdate: Posts = await this.viewPostById(id);

        if (postToUpdate.isLocked && !user.role.includes('admin')) {
            throw new BadRequestException(`Post has been locked by Admin`);
        }
        const postCreator: Users = await postToUpdate.author;

        if (postCreator.id !== user.id && !user.role.includes('admin')) {
            throw new BadRequestException(`This post is not published by your account`);
        }
        if (!title && !content) {
            throw new BadRequestException(`You have not provided a title or content to be updated!`);
        }
        if (title) {
        postToUpdate.title = title;
        }
        if (content) {
        postToUpdate.content = content;
        }
        postToUpdate.editor = user.username;

        const updatedPost: Posts = await this.postRepository.save(postToUpdate);

        return plainToClass(ResponsePostDTO, { ...updatedPost }, { excludeExtraneousValues: true });
    }
}