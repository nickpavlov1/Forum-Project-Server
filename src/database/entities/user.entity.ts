import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, BaseEntity, UpdateDateColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { UserRole } from '../../models/enums/user-roles.enum';
import * as bcrypt from 'bcrypt'
import { Posts } from './post.entity';
import { Comments } from './comment.entity';
import { BanStatus } from './ban.entity';
import { Votes } from './vote.entity';

@Entity()
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('nvarchar')
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;
  @Column('nvarchar')
  email: string;

  @Column('nvarchar')
  firstname: string;

  @Column('nvarchar')
  lastname: string;

  @Column({default: 'user'})
  role: UserRole;

  @Column('boolean',{ default: false })
  isDeleted: boolean;
  
  @CreateDateColumn()
  registered: Date;

  @UpdateDateColumn()
  updated: Date;

  @OneToMany(type => Posts, post => post.author, { eager: true })
  posts: Promise<Posts[]>;

  @OneToMany(type => Comments, comment => comment.author, { eager: true })
  comments: Promise<Comments[]>;

  @OneToMany(type => Votes, vote => vote.user)
  votes: Promise<Votes[]>
  
  @OneToOne(type => BanStatus, banStatus => banStatus.user, { eager: true })
  @JoinColumn()
  banStatus: BanStatus;
  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}