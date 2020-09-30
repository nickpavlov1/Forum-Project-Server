
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserRole } from 'src/models/enums/user-roles.enum';

@Injectable()
export class AdminGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return user && user.role.includes(UserRole.admin);
  }
}