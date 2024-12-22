import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from 'src/utils/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());

    if (!roles) {
      return true;
    }

    const req = context.switchToHttp().getRequest();

    const user = req.user;

    return this.matchRoles(roles, user.role);
  }

  private matchRoles(roles: string[], role: string) {
    return roles.includes(role);
  }
}
