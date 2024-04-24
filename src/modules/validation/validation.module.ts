import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { UserModule } from '~/modules/user/user.module';
import { validationPipe } from '~/modules/validation/pipes';

@Module({
  imports: [UserModule],
  providers: [
    {
      provide: APP_PIPE,
      useValue: validationPipe,
    },
  ],
})
export class ValidationModule {}
