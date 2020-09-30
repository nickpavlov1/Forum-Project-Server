import { Expose } from "class-transformer";
import { VoteType } from '../../enums/vote-type.enum';

export class VoteDTO {
    @Expose()
    id: string;

    @Expose()
    opinion: VoteType;
}