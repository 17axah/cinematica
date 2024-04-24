import {
  Controller,
  Get,
  Put,
  Query,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
} from '@nestjs/common';
import { UpdateUserDto } from '~/modules/user/dto';
import { UserService } from '~/modules/user/services';
import {
  ApiBody,
  ApiExtraModels,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from '~/swagger/api-paginated.decorator';
import { CurrentUserResponse, UserResponse } from '~/modules/user/types';
import { CurrentUser } from '~/modules/auth/decorators';
import { User } from '~/modules/user/schemas';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  FilesTypeValidator,
  MaxFilesSizeValidator,
} from '~/modules/validation/validators';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiExtraModels(UserResponse)
  @ApiPaginatedResponse(UserResponse)
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'offset', type: 'number', required: false })
  findAll(
    @CurrentUser() user: User,
    @Query('limit') limit = 10,
    @Query('skip') skip = 0,
  ) {
    return this.userService.findAll(user, +limit, +skip);
  }

  @Get('me')
  @ApiResponse({ type: CurrentUserResponse })
  get(@CurrentUser() user: User) {
    return this.userService.me(user);
  }

  @Put('me')
  update(@CurrentUser() user: User, @Body() dto: UpdateUserDto) {
    return this.userService.update(user, dto);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Put('me/avatar')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  uploadAvatar(
    @CurrentUser() user: User,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFilesSizeValidator({ maxSize: 2_500_000 }),
          new FilesTypeValidator({ fileType: /jpeg|jpg|png|svg/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.userService.uploadAvatar(user, file);
  }
}
