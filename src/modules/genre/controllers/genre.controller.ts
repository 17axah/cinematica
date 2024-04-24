import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '~/modules/auth/decorators';
import { User } from '~/modules/user/schemas';
import { GenreService } from '../services';
import { CreateGenreDto } from '../dto';
import { Genre } from '../schemas';

@ApiTags('genres')
@Controller('genres')
export class GenreController {
  constructor(private genreService: GenreService) {}

  @Get()
  @ApiOkResponse({
    description: 'The genre records',
    type: Genre,
    isArray: true,
  })
  findAll(@CurrentUser() user: User) {
    return this.genreService.findAll(user);
  }

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateGenreDto) {
    return this.genreService.create(user, dto);
  }

  @Delete('/:id')
  delete(@CurrentUser() user: User, @Param('id') id: string) {
    return this.genreService.delete(user, id);
  }
}
