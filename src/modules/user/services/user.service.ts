import * as fs from 'fs';
import { resolve } from 'path';
import { unlink } from 'fs/promises';
import { Model } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '~/modules/user/schemas';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto, UpdateUserDto } from '~/modules/user/dto';
import { flatten } from 'flat';
import { createFile } from '~/utils';
import { ConfigService } from '@nestjs/config';
import { USER_EXCLUDED_FIELDS } from '../consts';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private configService: ConfigService,
  ) {}

  me(user: User) {
    return user;
  }

  async findAll(user: User, limit: number, skip: number) {
    const [result] = await this.userModel.aggregate([
      {
        $unset: USER_EXCLUDED_FIELDS,
      },
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
          users: '$stage2',
        },
      },
    ]);

    return result || { count: 0, users: [] };
  }

  async create(dto: CreateUserDto) {
    const user = await this.userModel.findOne({ email: dto.email });

    if (user) {
      throw new BadRequestException(
        `User with email ${dto.email} already exists.`,
      );
    }

    const password = await bcrypt.hash(dto.password, 3);

    return this.userModel.create({ ...dto, password });
  }

  update(user: User, dto: UpdateUserDto) {
    user.$set(flatten(dto));

    return user.save();
  }

  async uploadAvatar(user: User, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(`The file was not transferred.`);
    }

    if (user.avatar) {
      const path = resolve(this.configService.get('STATIC_DIR'), user.avatar);

      if (fs.existsSync(path)) {
        await unlink(path);
      }
    }

    const avatar = await createFile(this.configService.get('STATIC_DIR'), file);

    user.$set('avatar', avatar);

    return user.save();
  }
}
