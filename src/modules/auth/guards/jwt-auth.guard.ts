import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { GUEST_KEY } from '~/modules/auth/consts';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isGuest = this.reflector.getAllAndOverride(GUEST_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isGuest) {
      return true;
    }
    return super.canActivate(context);
  }
}
