import {
    Controller,
    Get,
    Post,
    Delete,
    Put,
    Param,
    Body,
    ValidationPipe,
    ParseUUIDPipe, 
    UseGuards
} from '@nestjs/common';
import { PostsService } from './post.service';
import { Posts } from '../database/entities/post.entity';
import { CreatePostDTO } from '../models/dto/posts/create-posts.dto';
import { UpdatePostDTO } from '../models/dto/posts/update-posts.dto';
import { ResponsePostDTO } from '../models/dto/posts/response-posts.dto';
import { User } from '../common/decorators/user.decorator';
import { Users } from '../database/entities/user.entity';
import { BanGuard } from '../common/guards/ban.guard';
import { AuthGuardWithBlacklisting } from 'src/common/guards/blacklist.guard';


@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService) {}

    @Get()
    public async viewAllPosts() {
        return await this.postsService.viewAllPosts();
    }
    
    @UseGuards(AuthGuardWithBlacklisting, BanGuard)
    @Get('/:id')
    public async viewPostById(
        @Param('id', ParseUUIDPipe)
        id: string
        ): Promise<Posts> {
        return await this.postsService.viewPostById(id);
    }

    @UseGuards(AuthGuardWithBlacklisting, BanGuard)
    @Post('create')
    public async createPost(
    @Body(new ValidationPipe({ transform: true, whitelist: true })) createPostDTO: CreatePostDTO,
    @User() user: Users
    ): Promise<ResponsePostDTO> {
        
       return await this.postsService.createPost(createPostDTO, user);
    }

    @UseGuards(AuthGuardWithBlacklisting, BanGuard)
    @Delete('/:id')
    public async deletePost(@Param('id', ParseUUIDPipe) id: string,
    @User() user: Users
    ): Promise<void> {
        return await this.postsService.deletePost(id, user);
    }

    @UseGuards(AuthGuardWithBlacklisting, BanGuard)
    @Put('/:id')
    public async updatePost(
        @Param('id', ParseUUIDPipe) id: string,
        @Body(new ValidationPipe({ transform: true, whitelist: true })) updatePostDTO: UpdatePostDTO,
        @User() user: Users
    ): Promise<ResponsePostDTO> {
        return await this.postsService.updatePost(id, updatePostDTO, user);
    }
}
