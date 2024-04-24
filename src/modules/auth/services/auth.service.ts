import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { UserService } from '~/modules/user/services';
import * as bcrypt from 'bcryptjs';
import { User } from '~/modules/user/schemas';
import { AuthTokenService } from '~/modules/auth/services';
import { CreateUserDto } from '~/modules/user/dto';
import { InjectModel } from '@nestjs/mongoose';
import { Email } from '~/types';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private userService: UserService,
    private tokenService: AuthTokenService,
  ) {}

  async validateUser(email: Email, password: string) {
    const user = await this.userModel.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }

  login(user: User) {
    return this.tokenService.generateTokens(user);
  }

  async registration(dto: CreateUserDto) {
    const user = await this.userService.create(dto);

    return this.tokenService.generateTokens(user);
  }

  async refresh(refreshToken: string) {
    const payload = await this.tokenService.validateRefreshToken(refreshToken);
    const user = await this.userModel.findById(payload.userId);

    return this.tokenService.updateTokens(user, payload);
  }
}
