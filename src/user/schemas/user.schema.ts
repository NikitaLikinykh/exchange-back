// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  isEmailConfirmed: boolean;

  @Prop({ required: true })
  phone: string;

  @Prop()
  confirmationToken: string;

  @Prop()
  refreshToken: string; // Field to store the refresh token
}

export const UserSchema = SchemaFactory.createForClass(User);
