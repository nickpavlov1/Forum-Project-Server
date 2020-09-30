import { Controller, Put, ParseUUIDPipe, Param, Body, ValidationPipe, UseGuards } from '@nestjs/common';
import { VoteOpinionDTO } from '../models/dto/votes/vote-opinion.dto';
import { Users } from 'src/database/entities/user.entity';
import { VotesService } from './votes.service';
import { VoteDTO } from 'src/models/dto/votes/vote.dto';
import { User } from 'src/common/decorators/user.decorator';
import { BanGuard } from '../common/guards/ban.guard';
import { AuthGuardWithBlacklisting } from '../common/guards/blacklist.guard';

@Controller('posts/:postId')
@UseGuards(AuthGuardWithBlacklisting ,BanGuard)
export class VotesController {

    constructor(private voteService: VotesService) {}

    @Put('vote')
    public async ratePost(
        @Param('postId', ParseUUIDPipe) postId: string,
        @User() voter: Users,
        @Body(ValidationPipe) newVote: VoteOpinionDTO): Promise<VoteDTO> {
        return await this.voteService.ratePost(postId, voter, newVote);
    }

    @Put('comments/:commentId/vote')
    public async rateComment(
        @Param('commentId', ParseUUIDPipe) commentId: string,
        @User() voter: Users,
        @Body(new ValidationPipe({ transform: true, whitelist: true })) newVote: VoteOpinionDTO): Promise<VoteDTO> {
        return await this.voteService.rateComment(commentId, voter, newVote);
    }
}
