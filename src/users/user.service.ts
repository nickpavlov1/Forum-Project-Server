import { Injectable } from '@nestjs/common';
import { UserRepository } from '../users/user.repository';
import { RegisterUserDTO } from '../models/dto/users/register-user.dto';
import { UserDTO } from '../models/dto/users/user.dto';
import * as bcrypt from 'bcrypt'
import { plainToClass } from 'class-transformer';
import { Users } from '../database/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BanStatus } from '../database/entities/ban.entity';
import { BanRepository } from '../admin/ban-status.repository';

@Injectable()
export class UserService {
  constructor(
  @InjectRepository(UserRepository)
  private readonly userRepository: UserRepository,
  @InjectRepository(BanRepository)
  private readonly banRepository: BanRepository
  ) {}
  public async register(registerUserDTO: RegisterUserDTO): Promise<UserDTO> {
    const { username, password, email, firstname, lastname } = registerUserDTO;

    await this.userRepository.matchUserName(username);
    await this.userRepository.matchEmail(email);

    const user = new Users();
    
    user.salt = await bcrypt.genSalt();
    user.username = username;
    user.email = email;
    user.password = await this.passwordHash(password, user.salt);
    user.firstname = firstname;
    user.lastname = lastname;

    const registerdUser = await user.save();

    const banStatus: BanStatus = new BanStatus();

    banStatus.user = Promise.resolve(registerdUser);
    await this.banRepository.save(banStatus);
    
       return plainToClass(UserDTO, registerdUser, { excludeExtraneousValues: true });
    }
    private async passwordHash(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}