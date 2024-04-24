import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ROLE_ADMIN, ROLE_USER } from '~/modules/auth/consts';
import { Email } from '~/types';
import { ApiProperty } from '@nestjs/swagger';
import { ID } from '~/types';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  collection: 'users',
})
export class User extends mongoose.Document {
  @ApiProperty({ type: 'string' })
  _id: ID;

  @ApiProperty()
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: Email;

  @Prop({ required: true })
  password: string;

  @ApiProperty({ required: false, default: '' })
  @Prop({ trim: true, default: '' })
  name: string;

  @ApiProperty({ enum: [ROLE_ADMIN, ROLE_USER], isArray: true })
  @Prop({ uppercase: true, trim: true, default: [ROLE_USER] })
  roles: Array<string>;

  @ApiProperty({ required: false, default: '' })
  @Prop({ default: '' })
  avatar: string;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user.password;

  return user;
};

export { UserSchema };
