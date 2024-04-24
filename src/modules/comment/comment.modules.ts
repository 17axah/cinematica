import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './schemas';
import { CommentController } from './controllers';
import { CommentService } from './services';
import { FilmModule } from '../film/film.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    forwardRef(() => FilmModule),
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    CommentService,
  ],
})
export class CommentModule {}
