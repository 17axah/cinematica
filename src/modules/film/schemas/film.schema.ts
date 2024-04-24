import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { ID } from '~/types';
import { Genre } from '~/modules/genre/schemas';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  collection: 'films',
})
export class Film extends mongoose.Document {
  @ApiProperty({ type: 'string' })
  _id: ID;

  @ApiProperty()
  @Prop({ trim: true })
  title: string;

  @ApiProperty({ required: false, default: '' })
  @Prop({ trim: true, default: '' })
  description: string;

  @ApiProperty({ required: false, default: '' })
  @Prop({ default: '' })
  image: string;

  @ApiProperty({ required: false, default: 0 })
  @Prop({ default: 0 })
  rate: number;

  @ApiProperty({ type: Genre, isArray: true })
  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre', default: [] }])
  genres: mongoose.Schema.Types.ObjectId[];
}

const FilmSchema = SchemaFactory.createForClass(Film);

FilmSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'film',
});

export { FilmSchema };
