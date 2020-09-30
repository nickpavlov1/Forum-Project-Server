import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Users } from './user.entity';
import { Posts } from './post.entity';
import { Votes } from './vote.entity';

@Entity()
export class Comments extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(type => Posts, post => post.comments, { eager: false })
    post: Promise<Posts>;

    @Column('nvarchar')
    content: string;

    @ManyToOne(type => Users, user => user.comments, { eager: false })
    author: Promise<Users>;

    @OneToMany(type => Votes, vote => vote.comment, { eager: true })
    votes: Promise<Votes[]>

    @Column('boolean', { default: false })
    isDeleted: boolean;

    @CreateDateColumn()
    dateCreated: Date;

    @UpdateDateColumn()
    dateUpdated: Date;

    @Column('nvarchar', { default: null })
    editor: string;
}