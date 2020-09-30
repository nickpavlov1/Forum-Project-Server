import { Controller, Post, Body, ValidationPipe, Param, ParseUUIDPipe, UseGuards, Put, Delete, Get } from '@nestjs/common';
import { CreateCommentDTO } from '../models/dto/comments/create-comment.dto';
import { User } from 'src/common/decorators/user.decorator';
import { Users } from 'src/database/entities/user.entity';
import { CommentsService } from './comments.service';
import { ResponseCommentDTO } from '../models/dto/comments/response-comment.dto';
import { UpdateCommentDTO } from '../models/dto/comments/update-comment.dto';
import { BanGuard } from '../common/guards/ban.guard';
import { AuthGuardWithBlacklisting } from '../common/guards/blacklist.guard';


@Controller('posts/:postId/comments')
@UseGuards(AuthGuardWithBlacklisting, BanGuard)
export class CommentsController {

    constructor(private commentService: CommentsService) {}

    @Post()
    public async createComment(
        @Param('postId', ParseUUIDPipe) postId: string,
        @Body(new ValidationPipe({ transform: true, whitelist: true })) comment: CreateCommentDTO,
        @User() user: Users
        ): Promise<ResponseCommentDTO> {
            return await this.commentService.createComment(comment, user, postId);
        }
    
    @Put(':id')
    public async updateComment(
        @Param('id', ParseUUIDPipe) id: string,
        @User() user: Users,
        @Body(new ValidationPipe({ transform: true, whitelist: true })) updateComment: UpdateCommentDTO,
        @Param('postId', ParseUUIDPipe) postId: string,
        ){
            return await this.commentService.updateComment(id, user, updateComment, postId);
        }

    @Delete('/:id')
    public async deleteComment(
        @Param('id', ParseUUIDPipe) id: string,
        @User() user: Users,
        @Param('postId', ParseUUIDPipe) postId: string,
        ): Promise<string> {
            return await this.commentService.deleteComment(id, user, postId);
        }

    @Get()
    public async viewPostComments(
        @Param('postId', ParseUUIDPipe)
        postId: string
        ): Promise<ResponseCommentDTO[]> {
        return this.commentService.viewPostComments(postId);
    }
}
