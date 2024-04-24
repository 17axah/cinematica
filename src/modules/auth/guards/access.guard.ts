import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  ACCESS_BAN,
  ACCESS_BLANK,
  ALLOW_KEY,
  GUEST_KEY,
} from '~/modules/auth/consts';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isGuest = this.reflector.getAllAndOverride(GUEST_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isGuest) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    const allows =
      this.reflector.getAllAndOverride<string[]>(ALLOW_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || [];

    if (user.banned && !allows.includes(ACCESS_BAN)) {
      throw new ForbiddenException('Banned');
    }

    if (user.blank && !allows.includes(ACCESS_BLANK)) {
      throw new ForbiddenException('Blank');
    }

    return true;
  }
}
