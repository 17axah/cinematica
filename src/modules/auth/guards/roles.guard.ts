import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '~/modules/auth/consts';

function toLowerRoles(roles) {
  return roles.map((role) => role.toLowerCase());
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const req = context.switchToHttp().getRequest();

      const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      return toLowerRoles(req.user.roles).some((role) =>
        toLowerRoles(roles).includes(role),
      );
    } catch (e) {
      return false;
    }
  }
}
