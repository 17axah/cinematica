import { Model } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Genre } from '../schemas';
import { User } from '~/modules/user/schemas';
import { CreateGenreDto } from '../dto';
import { Film } from '~/modules/film/schemas';

@Injectable()
export class GenreService {
  constructor(
    @InjectModel(Genre.name) private genreModel: Model<Genre>,
    @InjectModel(Film.name) private filmModel: Model<Film>,
  ) {}

  async findAll(user: User) {
    return this.genreModel.find();
  }

  create(user: User, dto: CreateGenreDto) {
    return this.genreModel.create(dto);
  }

  async delete(user: User, id: string) {
    const genre = await this.genreModel.findById(id);

    if (!genre) {
      throw new BadRequestException(`Genre not found.`);
    }

    await this.filmModel.updateMany(
      { genres: id },
      {
        $pull: {
          genres: id,
        },
      },
    );

    return this.genreModel.findByIdAndDelete(id);
  }
}
