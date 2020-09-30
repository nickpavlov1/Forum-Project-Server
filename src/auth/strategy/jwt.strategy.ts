import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { IJWTPayload } from './interface/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../../users/user.repository';
import { Users } from '../../database/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(@InjectRepository(UserRepository) private userRepository: UserRepository, private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),           
            secretOrKey: configService.get('JWT_SECRET_KEY')
        });
    }

    public async validate(payload: IJWTPayload): Promise<Users> {
        const { username } = payload;
        const user = await this.userRepository.findOne({ username });
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}