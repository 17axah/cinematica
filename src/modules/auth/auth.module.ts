import { Module, forwardRef } from '@nestjs/common';
import { UserModule } from '~/modules/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '~/modules/auth/services';
import { AuthController } from '~/modules/auth/controllers';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import {
  JwtRefreshStrategy,
  JwtStrategy,
  LocalStrategy,
} from '~/modules/auth/strategies';
import { AccessGuard, JwtAuthGuard } from '~/modules/auth/guards';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '~/modules/user/schemas';
import { AuthToken, AuthTokenSchema } from '~/modules/auth/schemas';
import { AuthTokenService } from '~/modules/auth/services';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AccessGuard,
    },
    AuthService,
    AuthTokenService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: AuthToken.name, schema: AuthTokenSchema },
    ]),
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.register({}),
  ],
  exports: [JwtModule, AuthTokenService],
  controllers: [AuthController],
})
export class AuthModule {}
