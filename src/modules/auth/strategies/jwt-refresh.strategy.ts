import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { RefreshTokenPayload } from '~/modules/auth/dto';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: config.get('JWT_REFRESH_TOKEN_SECRET_KEY'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: RefreshTokenPayload) {
    return payload;
  }
}
