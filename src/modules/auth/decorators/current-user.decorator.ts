import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '~/modules/user/schemas';

function getUser(data, ctx: ExecutionContext): User {
  const req = ctx.switchToHttp().getRequest();

  return req.user;
}

export const CurrentUser = createParamDecorator(getUser);
