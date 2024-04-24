import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { ID } from '~/types';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  collection: 'comments',
})
export class Comment extends mongoose.Document {
  @ApiProperty({ type: 'string' })
  _id: ID;

  @ApiProperty({ default: '' })
  @Prop({ trim: true, default: '' })
  message: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Schema.Types.ObjectId;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Film' })
  film: mongoose.Schema.Types.ObjectId;
}

const CommentSchema = SchemaFactory.createForClass(Comment);

export { CommentSchema };
