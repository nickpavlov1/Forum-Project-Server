import { Repository, EntityRepository } from 'typeorm';
import { Users } from '../database/entities/user.entity';
import { LoginUserDTO } from '../models/dto/users/login-user.dto';
import { ConflictException } from '@nestjs/common';

@EntityRepository(Users)
export class UserRepository extends Repository<Users> {

    public async matchUserName(username: string): Promise<void> {
        const matchUser = await this.findOne({ 
        where: { username: username }
        });
        if (matchUser) {
          throw new ConflictException(`This username ${username} is already taken!`);
        }
    }
    public async matchEmail(email: string): Promise<void> {
      const matchEmail = await this.findOne({ 
      where: { email: email }
      });
      if (matchEmail) {
        throw new ConflictException(`This username ${email} is already taken!`);
      }
  }
    public async validateUserPassword(loginUserDTO: LoginUserDTO) {
        const matchUser = loginUserDTO;
        const user = await this.findOne({
          where: { username: matchUser.username, isDeleted: false }
        });
        if (user && await user.validatePassword(matchUser.password)) {
          return matchUser.username;
        } else {
          return null;
        }
      }
}