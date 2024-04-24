import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '~/modules/auth/auth.module';
import { DatabaseModule } from './database.module';
import { UserModule } from '~/modules/user/user.module';
import { ValidationModule } from '~/modules/validation/validation.module';
import { FilmModule } from './film/film.module';
import { LikeModule } from './like/like.module';
import { GenreModule } from './genre/genre.module';
import { CommentModule } from './comment/comment.modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    DatabaseModule,
    ValidationModule,
    AuthModule,
    UserModule,
    FilmModule,
    LikeModule,
    GenreModule,
    CommentModule,
  ],
})
export class AppModule {}
