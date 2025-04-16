// src/users/interfaces/user.interface.ts
import { Document } from 'mongoose';

export interface User extends Document {
  email: string;
  password: string;
  isEmailConfirmed: boolean;
  confirmationToken?: string;
}
