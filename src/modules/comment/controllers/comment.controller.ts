import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '~/modules/auth/decorators';
import { User } from '~/modules/user/schemas';
import { CommentService } from '../services';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { Comment } from '../schemas';

@ApiTags('comments')
@Controller('comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get()
  @ApiOkResponse({
    description: 'The comment records',
    type: Comment,
    isArray: true,
  })
  @ApiQuery({ name: 'filmId', type: 'string', required: false })
  findAll(@CurrentUser() user: User, @Query('filmId') filmId) {
    return this.commentService.findAll(user, filmId);
  }

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateCommentDto) {
    return this.commentService.create(user, dto);
  }

  @Delete('/:id')
  delete(@CurrentUser() user: User, @Param('id') id: string) {
    return this.commentService.delete(user, id);
  }
}
