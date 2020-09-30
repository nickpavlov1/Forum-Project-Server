import { PrimaryGeneratedColumn, Column, OneToOne, Entity, BaseEntity } from 'typeorm';
import { Users } from './user.entity';

@Entity()
export class BanStatus extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('boolean', { default: false})
    isBanned: boolean;
  
    @Column('nvarchar', { nullable: true, default: null })
    description?: string;
  
    @Column('date', { nullable: true, default: null })
    expDate?: Date;
  
    @OneToOne(type => Users, users => users.banStatus)
    user: Promise<Users>;
}