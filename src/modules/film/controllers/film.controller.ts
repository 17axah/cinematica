import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from '~/swagger/api-paginated.decorator';
import { CurrentUser } from '~/modules/auth/decorators';
import { User } from '~/modules/user/schemas';
import { FilmService } from '../services';
import { FilmResponse } from '../types';
import { CreateFilmDto } from '../dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  FilesTypeValidator,
  MaxFilesSizeValidator,
} from '~/modules/validation/validators';
import { UpdateFilmDto } from '../dto/update-film.dto';
import { Film } from '../schemas';

@ApiTags('films')
@Controller('films')
export class FilmController {
  constructor(private filmService: FilmService) {}

  @Get()
  @ApiExtraModels(FilmResponse)
  @ApiPaginatedResponse(FilmResponse)
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'offset', type: 'number', required: false })
  findAll(
    @CurrentUser() user: User,
    @Query('limit') limit = 10,
    @Query('skip') skip = 0,
  ) {
    return this.filmService.findAll(user, +limit, +skip);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Put('/:id/image')
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
    @Param('id') id: string,
  ) {
    return this.filmService.uploadImage(user, id, file);
  }

  @Get('/:id')
  @ApiOkResponse({
    description: 'The film record',
    type: Film,
  })
  findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.filmService.findOne(user, id);
  }

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateFilmDto) {
    return this.filmService.create(user, dto);
  }

  @Put('/:id')
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateFilmDto,
  ) {
    return this.filmService.update(user, id, dto);
  }

  @Delete('/:id')
  delete(@CurrentUser() user: User, @Param('id') id: string) {
    return this.filmService.delete(user, id);
  }
}
