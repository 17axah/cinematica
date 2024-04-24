import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '~/modules/auth/services';
import { Guest } from '~/modules/auth/decorators';
import { CurrentUser } from '~/modules/auth/decorators';
import { JwtRefreshGuard, LocalAuthGuard } from '~/modules/auth/guards';
import { User } from '~/modules/user/schemas';
import { CreateUserDto } from '~/modules/user/dto';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from '~/modules/user/dto/login-user.dto';

@ApiTags('auth')
@Controller('auth')
@Guest()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('refresh')
  @ApiBody({
    schema: { allOf: [{ properties: { refreshToken: { type: 'string' } } }] },
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        {
          properties: {
            refreshToken: {
              type: 'string',
            },
            accessToken: {
              type: 'string',
            },
          },
        },
      ],
    },
  })
  @UseGuards(JwtRefreshGuard)
  refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  @ApiBody({ type: LoginUserDto })
  @ApiOkResponse({
    schema: {
      allOf: [
        {
          properties: {
            refreshToken: {
              type: 'string',
            },
            accessToken: {
              type: 'string',
            },
          },
        },
      ],
    },
  })
  @Post('sign-in')
  @UseGuards(LocalAuthGuard)
  login(@CurrentUser() user: User) {
    return this.authService.login(user);
  }

  @ApiOkResponse({
    schema: {
      allOf: [
        {
          properties: {
            refreshToken: {
              type: 'string',
            },
            accessToken: {
              type: 'string',
            },
          },
        },
      ],
    },
  })
  @Post('sign-up')
  registration(@Body() dto: CreateUserDto) {
    return this.authService.registration(dto);
  }
}
