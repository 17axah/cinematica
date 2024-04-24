import { Model } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '~/modules/user/schemas';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { Comment } from '../schemas';
import { Film } from '~/modules/film/schemas';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Film.name) private filmModel: Model<Film>,
  ) {}

  async findAll(user: User, filmId: string) {
    const filterEntries = Object.entries({
      film: filmId,
    }).filter(([, value]) => !!value);

    const filter = Object.fromEntries(filterEntries);

    try {
      return await this.commentModel.find(filter).populate(['user', 'film']);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async create(user: User, dto: CreateCommentDto) {
    const film = await this.filmModel.findById(dto.filmId);

    if (!film) {
      throw new BadRequestException(`Film not found.`);
    }

    return this.commentModel.create({
      film: dto.filmId,
      user: user.id,
      message: dto.message,
    });
  }

  async delete(user: User, id: string) {
    const comment = await this.commentModel.findById(id);

    if (!comment) {
      throw new BadRequestException(`Comment not found.`);
    }

    if (String(comment.user) !== String(user.id)) {
      throw new BadRequestException(`This comment is not yours.`);
    }

    return this.commentModel.findByIdAndDelete(id);
  }
}
