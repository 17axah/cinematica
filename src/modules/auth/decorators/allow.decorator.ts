import { SetMetadata } from '@nestjs/common';
import { ALLOW_KEY } from '~/modules/auth/consts';

export const Allow = (...allows: string[]) => SetMetadata(ALLOW_KEY, allows);
