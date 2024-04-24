import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { ID } from '~/types';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  collection: 'genres',
})
export class Genre extends mongoose.Document {
  @ApiProperty({ type: 'string' })
  _id: ID;

  @ApiProperty({ required: true })
  @Prop({ trim: true, required: true })
  name: string;
}

const GenreSchema = SchemaFactory.createForClass(Genre);

export { GenreSchema };
