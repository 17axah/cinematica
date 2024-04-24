import { Model } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like } from '../schemas';
import { User } from '~/modules/user/schemas';
import { CreateLikeDto } from '../dto';
import { Film } from '~/modules/film/schemas';
import { DeleteLikeDto } from '../dto/delete-like.dto';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(Like.name) private likeModel: Model<Like>,
    @InjectModel(Film.name) private filmModel: Model<Film>,
  ) {}

  findAll(user: User) {
    return this.likeModel.find().populate(['user', 'film']);
  }

  async create(user: User, dto: CreateLikeDto) {
    const film = await this.filmModel.findById(dto.filmId);

    if (!film) {
      throw new BadRequestException(`Film not found.`);
    }

    const like = await this.likeModel.findOne({
      user: user.id,
      film: dto.filmId,
    });

    if (like) {
      throw new BadRequestException(`Like for this film already exists.`);
    }

    return this.likeModel.create({ user: user.id, film: dto.filmId });
  }

  async delete(user: User, dto: DeleteLikeDto) {
    const like = await this.likeModel.findOne({
      user: user.id,
      film: dto.filmId,
    });

    if (!like) {
      throw new BadRequestException(`Like not found.`);
    }

    return this.likeModel.deleteMany({
      user: user.id,
      film: dto.filmId,
    });
  }
}
