import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';

import { Users } from './user.entity';
import { Posts } from './post.entity';
import { Comments } from './comment.entity';
import { VoteType } from '../../models/enums/vote-type.enum';

@Entity()
export class Votes {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    date: Date;
    
    @Column({ type: 'enum', enum: VoteType, default: VoteType.default })
    voteType: VoteType;

    @ManyToOne(type => Users, user => user.votes)
    user: Promise<Users>;

    @ManyToOne(type => Posts, post => post.votes)
    post: Promise<Posts>;

    @ManyToOne(type => Comments, comment => comment.votes)
    comment: Promise<Comments>;
}