import { UserRole } from '../../enums/user-roles.enum';
import { Expose } from 'class-transformer';
import { BanStatus } from '../../../database/entities/ban.entity';
export class UserDTO {
    @Expose()
    id: string;

    @Expose()
    username: string;

    @Expose()
    email: string;

    @Expose()
    firstName: string;

    @Expose()
    lastName: string;

    @Expose()
    registered: Date;

    @Expose()
    updated: Date;

    @Expose()
    role: UserRole;

    @Expose()
    banStatus: BanStatus;
    
  }