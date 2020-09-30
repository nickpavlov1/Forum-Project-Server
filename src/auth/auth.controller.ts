import { Controller, Post, Body, ValidationPipe, UseGuards, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDTO } from '../models/dto/users/login-user.dto';
import { Token } from '../common/decorators/token.decorator';
import { AuthGuardWithBlacklisting } from 'src/common/guards/blacklist.guard';
// import { BanGuard } from '../common/guards/ban.guard';



@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    // @UseGuards(BanGuard)
    public login(@Body(new ValidationPipe({ transform: true, whitelist: true })) loginUserDTO: LoginUserDTO): Promise<{ accessToken: string }> {
        return this.authService.login(loginUserDTO);
    }
    @Delete('logout')
    @UseGuards(AuthGuardWithBlacklisting)
    public logout(@Token() token: string) {
        this.authService.blacklistToken(token);

        return {
          msg: 'Successful logout!',
        };
    }
}

