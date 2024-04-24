import { SetMetadata } from '@nestjs/common';
import { GUEST_KEY } from '~/modules/auth/consts';

export const Guest = () => SetMetadata(GUEST_KEY, true);
