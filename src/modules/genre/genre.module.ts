import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { GenreController } from './controllers';
import { GenreService } from './services';
import { Genre, GenreSchema } from './schemas';
import { FilmModule } from '../film/film.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Genre.name, schema: GenreSchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => FilmModule),
  ],
  controllers: [GenreController],
  providers: [GenreService],
  exports: [
    MongooseModule.forFeature([{ name: Genre.name, schema: GenreSchema }]),
    GenreService,
  ],
})
export class GenreModule {}
