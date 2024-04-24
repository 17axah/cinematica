import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '~/modules/auth/decorators';
import { User } from '~/modules/user/schemas';
import { LikeService } from '../services';
import { CreateLikeDto } from '../dto';
import { DeleteLikeDto } from '../dto/delete-like.dto';
import { Like } from '../schemas';

@ApiTags('likes')
@Controller('likes')
export class LikeController {
  constructor(private likeService: LikeService) {}

  @Get()
  @ApiOkResponse({
    description: 'The like records',
    type: Like,
    isArray: true,
  })
  findAll(@CurrentUser() user: User) {
    return this.likeService.findAll(user);
  }

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateLikeDto) {
    return this.likeService.create(user, dto);
  }

  @Delete()
  delete(@CurrentUser() user: User, @Body() dto: DeleteLikeDto) {
    return this.likeService.delete(user, dto);
  }
}
