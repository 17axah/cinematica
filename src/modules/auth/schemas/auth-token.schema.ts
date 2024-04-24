import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'tokens',
  timestamps: { createdAt: true, updatedAt: false },
})
export class AuthToken extends mongoose.Document {
  @Prop()
  signature: string;

  @Prop()
  expireAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Schema.Types.ObjectId;
}

const AuthTokenSchema = SchemaFactory.createForClass(AuthToken);

AuthTokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export { AuthTokenSchema };
