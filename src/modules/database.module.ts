import * as mongoose from 'mongoose';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

mongoose.set('returnOriginal', false);
// mongoose.set('debug', true);

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get('DB_URI'),
      }),
    }),
  ],
})
export class DatabaseModule {}
