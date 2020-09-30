import { IsEnum } from "class-validator";
import { VoteType } from '../../enums/vote-type.enum';

export class VoteOpinionDTO {
    
    @IsEnum(VoteType)
    voteType: VoteType;
}