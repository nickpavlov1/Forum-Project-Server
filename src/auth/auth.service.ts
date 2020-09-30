import { Injectable, UnauthorizedException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../users/user.repository';
import { LoginUserDTO } from '../models/dto/users/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { IJWTPayload } from '../auth/strategy/interface/jwt-payload.interface';
import { Users } from '../database/entities/user.entity';

@Injectable()
export class AuthService {

    private readonly blacklist: string[] = [];
    constructor(
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,

        private readonly jwtService: JwtService,
    ) {}

    public async login(loginUserDTO: LoginUserDTO): Promise<{ accessToken: string }> {
      const username = await this.userRepository.validateUserPassword(loginUserDTO)
      if (!username) {
        throw new UnauthorizedException('Invalid credentials!');
      }
      const user: Users = await this.userRepository.findOne({
        where: { username: username }
      })

      const payload: IJWTPayload = { ...user };
      const accessToken = await this.jwtService.signAsync(payload);
        return { accessToken };
    }
      public blacklistToken(token: string): void {
        this.blacklist.push(token);
      }

      public isTokenBlacklisted(token: string): boolean {
        return this.blacklist.includes(token);
      }
}
