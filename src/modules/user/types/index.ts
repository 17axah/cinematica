import { ApiSchema } from '~/swagger/api-schema.decorator';
import { User } from '~/modules/user/schemas';
import { USER_EXCLUDED_FIELDS } from '~/modules/user/consts';
import { OmitType } from '@nestjs/swagger';

export type Gender = 'male' | 'female';
export type GenderAll = 'all';
export type GenderNone = 'none';

@ApiSchema({ name: 'User' })
export class UserResponse extends OmitType(
  User,
  USER_EXCLUDED_FIELDS as readonly (keyof User)[],
) {}

@ApiSchema({ name: 'CurrentUser' })
export class CurrentUserResponse extends User {}
