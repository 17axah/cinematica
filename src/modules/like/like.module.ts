import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { LikeController } from './controllers';
import { LikeService } from './services';
import { Like, LikeSchema } from './schemas';
import { FilmModule } from '../film/film.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => FilmModule),
  ],
  controllers: [LikeController],
  providers: [LikeService],
  exports: [
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
    LikeService,
  ],
})
export class LikeModule {}
