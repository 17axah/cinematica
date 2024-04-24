import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { RefreshTokenPayload, AccessTokenPayload } from '~/modules/auth/dto';
import { AuthToken } from '~/modules/auth/schemas';
import { User } from '~/modules/user/schemas';
import { ID } from '~/types';

@Injectable()
export class AuthTokenService {
  constructor(
    private config: ConfigService,
    private jwtService: JwtService,
    @InjectModel(AuthToken.name) private tokenModel: Model<AuthToken>,
  ) {}

  private signRefreshPayload(payload) {
    return this.jwtService.sign(
      instanceToPlain(plainToClass(RefreshTokenPayload, payload)),
      {
        secret: this.config.get('JWT_REFRESH_TOKEN_SECRET_KEY'),
        expiresIn: this.config.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
      },
    );
  }

  private signAccessPayload(user: User) {
    const payload = instanceToPlain(plainToClass(AccessTokenPayload, user));

    return this.jwtService.sign(payload, {
      secret: this.config.get('JWT_ACCESS_TOKEN_SECRET_KEY'),
      expiresIn: this.config.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    });
  }

  private getTokenSignature(token: string) {
    return token.split('.').pop();
  }

  private getRefreshData(token: string) {
    const decoded: any = this.jwtService.decode(token);

    return {
      expireAt: new Date(decoded.exp * 1000),
      signature: token.split('.').pop(),
    };
  }

  private async generateRefreshToken(user: User) {
    const instance = new this.tokenModel({ user: user._id });

    const token = this.signRefreshPayload({
      userId: user.id,
      tokenId: instance.id,
    });

    const { signature, expireAt } = this.getRefreshData(token);

    instance.signature = signature;
    instance.expireAt = expireAt;

    instance.save();

    return token;
  }

  private async updateRefreshToken(payload: RefreshTokenPayload) {
    const token = this.signRefreshPayload(payload);
    const { signature, expireAt } = this.getRefreshData(token);

    await this.tokenModel.findByIdAndUpdate(payload.tokenId, {
      expireAt,
      signature,
    });

    return token;
  }

  async validateRefreshToken(refreshToken: string) {
    const payload: any = this.jwtService.decode(refreshToken);
    const instance = await this.tokenModel.findById(payload.tokenId);

    if (
      instance &&
      instance.signature === this.getTokenSignature(refreshToken)
    ) {
      return payload;
    }

    throw new UnauthorizedException();
  }

  async generateTokens(user: User) {
    return {
      accessToken: this.signAccessPayload(user),
      refreshToken: await this.generateRefreshToken(user),
    };
  }

  async updateTokens(user: User, payload: RefreshTokenPayload) {
    return {
      accessToken: this.signAccessPayload(user),
      refreshToken: await this.updateRefreshToken(payload),
    };
  }

  removeByUserId(user: ID) {
    return this.tokenModel.deleteMany({ user });
  }
}
