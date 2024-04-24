import * as fs from 'fs';
import mongoose, { Model } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Film } from '../schemas';
import { User } from '~/modules/user/schemas';
import { CreateFilmDto } from '../dto';
import { resolve } from 'path';
import { ConfigService } from '@nestjs/config';
import { unlink } from 'fs/promises';
import { createFile } from '~/utils';
import { Like } from '~/modules/like/schemas';
import { UpdateFilmDto } from '../dto/update-film.dto';
import { Genre } from '~/modules/genre/schemas';

@Injectable()
export class FilmService {
  constructor(
    @InjectModel(Film.name) private filmModel: Model<Film>,
    @InjectModel(Like.name) private likeModel: Model<Like>,
    @InjectModel(Genre.name) private genreModel: Model<Genre>,
    private configService: ConfigService,
  ) {}

  private getAggregatePipelines() {
    return [
      {
        $lookup: {
          from: 'genres',
          foreignField: '_id',
          localField: 'genres',
          as: 'genres',
        },
      },
      {
        $lookup: {
          from: 'likes',
          foreignField: 'film',
          localField: '_id',
          as: 'likes',
          let: { likes: '$likes' },
          pipeline: [
            {
              $lookup: {
                from: 'users',
                foreignField: '_id',
                localField: 'user',
                as: 'user',
              },
            },
            { $unwind: '$user' },
            {
              $unset: ['user.password'],
            },
          ],
        },
      },
    ];
  }

  async create(user: User, dto: CreateFilmDto) {
    try {
      if (dto.genres) {
        const genres = await this.genreModel.find({ _id: { $in: dto.genres } });

        if (genres.length < dto.genres.length) {
          throw new BadRequestException('Genre ids wrong.');
        }
      }

      return await this.filmModel.create(dto);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async update(user: User, id: string, dto: UpdateFilmDto) {
    try {
      if (dto.genres) {
        const genres = await this.genreModel.find({ _id: { $in: dto.genres } });

        if (genres.length < dto.genres.length) {
          throw new BadRequestException('Genre ids wrong.');
        }
      }

      return await this.filmModel.findByIdAndUpdate(id, dto);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async delete(user: User, id: string) {
    const film = await this.filmModel.findById(id);

    if (!film) {
      throw new BadRequestException(`Film not found.`);
    }

    await this.likeModel.deleteMany({ film: id });

    return this.filmModel.findByIdAndDelete(id);
  }

  async findOne(user: User, id: string) {
    const [result] = await this.filmModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      ...this.getAggregatePipelines(),
    ]);

    return result || null;
  }

  async findAll(user: User, limit: number, skip: number) {
    const [result] = await this.filmModel.aggregate([
      ...this.getAggregatePipelines(),
      {
        $facet: {
          stage1: [{ $group: { _id: null, count: { $sum: 1 } } }],
          stage2: [{ $skip: skip }, { $limit: limit }],
        },
      },
      { $unwind: '$stage1' },
      {
        $project: {
          count: '$stage1.count',
          films: '$stage2',
        },
      },
    ]);

    return result || { count: 0, films: [] };
  }

  async uploadImage(user: User, id, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(`The file was not transferred.`);
    }

    const film = await this.filmModel.findById(id);

    if (!film) {
      throw new BadRequestException(`Film not found.`);
    }

    if (film.image) {
      const path = resolve(this.configService.get('STATIC_DIR'), film.image);

      if (fs.existsSync(path)) {
        await unlink(path);
      }
    }

    const image = await createFile(this.configService.get('STATIC_DIR'), file);

    film.$set('image', image);

    return film.save();
  }
}
