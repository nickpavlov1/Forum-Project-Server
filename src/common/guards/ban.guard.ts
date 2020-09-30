import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { AdminService } from "../../admin/admin.service";
import { Users } from "../../database/entities/user.entity";

@Injectable()
export class BanGuard implements CanActivate {
  constructor(
    private readonly adminService: AdminService
    ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: Users = request.user;
    if (user && user.banStatus.isBanned) {
      const currentTime = new Date();
      const expirationDate = new Date(user.banStatus.expDate);
      if (currentTime.getDate() < expirationDate.getDate()) {
        throw new ForbiddenException(`Your account is currently banned`);
      } else {
        await this.adminService.unbanUser(user.id);
        return !!user;
      }
    }
    return user && !user.banStatus.isBanned;
  }
}