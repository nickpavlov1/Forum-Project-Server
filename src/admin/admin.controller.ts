import { Controller, ValidationPipe, Body, ParseUUIDPipe, Param, UseGuards, Put, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { BanStatusDTO } from '../models/dto/ban/ban-status.dto';
import { SetBanStatusDTO } from '../models/dto/ban/set-ban-status.dto';
import { PostLockChangeDTO } from '../models/dto/posts/lock-change-post.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { UserDTO } from 'src/models/dto/users/user.dto';
import { AuthGuardWithBlacklisting } from '../common/guards/blacklist.guard';

@Controller('admin')
@UseGuards(AuthGuardWithBlacklisting, AdminGuard)
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Put('users/:id/ban')
    public async banUser(
    @Param('id', ParseUUIDPipe)
    id: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    banOrder: SetBanStatusDTO,
    ): Promise<BanStatusDTO> {
        return await this.adminService.banUser(id, banOrder);
    }

    @Put('users/:id')
    public async unbanUser(
    @Param('id', ParseUUIDPipe)
    id: string,
    ): Promise<BanStatusDTO> {
        return await this.adminService.unbanUser(id);
    }

    @Put('posts/:id/lock')
    public async lockPost(
    @Param('id', ParseUUIDPipe)
    id: string
    ): Promise<PostLockChangeDTO> {
        return this.adminService.lockPost(id);
    }

    @Put('posts/:id')
    public async unlockPost(
    @Param('id', ParseUUIDPipe)
    id: string
    ): Promise<PostLockChangeDTO> {
        return this.adminService.unlockPost(id);
    }

    @Delete('users/:id')
    public async deleteUser(
    @Param('id', ParseUUIDPipe)
    id: string
    ): Promise<UserDTO> {
        return this.adminService.deleteUser(id);
    }
}
