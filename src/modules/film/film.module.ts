import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { FilmController } from './controllers';
import { FilmService } from './services';
import { Film, FilmSchema } from './schemas';
import { LikeModule } from '../like/like.module';
import { GenreModule } from '../genre/genre.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => LikeModule),
    forwardRef(() => GenreModule),
  ],
  controllers: [FilmController],
  providers: [FilmService],
  exports: [
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
    FilmService,
  ],
})
export class FilmModule {}
