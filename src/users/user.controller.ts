import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { RegisterUserDTO } from '../models/dto/users/register-user.dto';
import { UserDTO } from '../models/dto/users/user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('/register')
public async register(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    registerUserDTO: RegisterUserDTO
    ): Promise<UserDTO> {
    return this.userService.register(registerUserDTO);    
}
}