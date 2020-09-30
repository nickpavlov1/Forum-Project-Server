import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostRepository } from '../posts/post.repository';
import { CommentRepository } from 'src/comments/comments.repository';
import { Posts } from 'src/database/entities/post.entity';
import { VoteOpinionDTO } from '../models/dto/votes/vote-opinion.dto';
import { VoteDTO } from '../models/dto/votes/vote.dto';
import { Users } from 'src/database/entities/user.entity';
import { Votes } from 'src/database/entities/vote.entity';
import { plainToClass } from 'class-transformer';
import { Comments } from 'src/database/entities/comment.entity';
import { VoteType } from 'src/models/enums/vote-type.enum';
import { Repository } from 'typeorm';

@Injectable()
export class VotesService {

    constructor(
    @InjectRepository(Votes)
    private readonly voteRepository: Repository<Votes>,
    @InjectRepository(PostRepository)
    private readonly postRepository: PostRepository,
    @InjectRepository(CommentRepository)
    private readonly commentRepository: CommentRepository,
    ) {}
    
    public async ratePost(id: string, voter: Users, newVote: VoteOpinionDTO ): Promise<VoteDTO> {
        if (voter.isDeleted) {
            throw new ForbiddenException(`Forbidden action`);
        }
        const targetPost: Posts = await this.postRepository.viewPostById(id);

        if (targetPost.isLocked && !voter.role.includes('admin')) {
            throw new BadRequestException(`Post has been locked by the Admin`);
        }
        const postVotes: Votes[] = await targetPost.votes;
            

        for(const vote of postVotes) {  
            const previousVoter: Users = await vote.user;
            if (previousVoter.username === voter.username) {
                if (vote.voteType == newVote.voteType) {
                    vote.voteType = VoteType.default;
                } else if (vote.voteType != newVote.voteType) {
                    vote.voteType = newVote.voteType;
                }
                const changeOpinion: Votes = await this.voteRepository.save(vote);
                
                return plainToClass(VoteDTO, { ...changeOpinion, id }, { excludeExtraneousValues: true });
            }
        }
        const addOpinion = this.voteRepository.create(newVote);

        addOpinion.user = Promise.resolve(voter);
        addOpinion.post = Promise.resolve(targetPost);
        addOpinion.voteType = newVote.voteType;

        const saveOpinion = await this.voteRepository.save(addOpinion);

        return plainToClass(VoteDTO, { ...saveOpinion, id }, { excludeExtraneousValues: true });
        }
    public async rateComment(id: string, voter: Users, newVote: VoteOpinionDTO ): Promise<VoteDTO> {
        if (voter.isDeleted) {
            throw new ForbiddenException(`Forbidden action`);
        }
        const targetComment: Comments = await this.commentRepository.viewCommentById(id)
        if ((await targetComment.post).isLocked && !voter.role.includes('admin')) {
            throw new BadRequestException(`Post has been locked by the Admin`);
        }
        const commentVotes: Votes[] = await targetComment.votes;

        for(const vote of commentVotes) {
            const previousVoter: Users = await vote.user;
            if (previousVoter.id === voter.id) {
                if (vote.voteType == newVote.voteType) {
                    vote.voteType = VoteType.default;
                } else if (vote.voteType != newVote.voteType) {
                    vote.voteType = newVote.voteType;
                }
                const changeOpinion: Votes = await this.voteRepository.save(newVote);
                
                return plainToClass(VoteDTO, { ...changeOpinion, id }, { excludeExtraneousValues: true });
            }
        }
        const addOpinion: Votes = this.voteRepository.create(newVote);

        addOpinion.voteType = newVote.voteType;
        addOpinion.user = Promise.resolve(voter);
        addOpinion.comment = Promise.resolve(targetComment);

        const saveOpinion: Votes = await this.voteRepository.save(addOpinion);

        return plainToClass(VoteDTO, { ...saveOpinion, id }, { excludeExtraneousValues: true });
    }
}