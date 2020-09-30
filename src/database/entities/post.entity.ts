import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,  ManyToOne, OneToMany } from "typeorm";
import { Users } from "./user.entity";
import { Comments } from "./comment.entity";
import { Votes } from "./vote.entity";

@Entity()
export class Posts extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    title:string;
    @Column()
    content: string;
    @CreateDateColumn()
    dateCreated: string;
    @UpdateDateColumn()
    dateUpdated: string;

    @Column('boolean',{ default: false })
    isLocked: boolean;

    @Column('boolean',{ default: false })
    isDeleted: boolean;

    @ManyToOne(type => Users, user => user.posts, { eager: false })
    author: Promise<Users>;

    @OneToMany(type => Comments, comment => comment.post, { eager: true })
    comments: Promise<Comments[]>;

    @OneToMany(type => Votes, vote => vote.post, { eager: true })
    votes: Promise<Votes[]>;
    
    @Column('nvarchar')
    editor: string;
}