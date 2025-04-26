// src/users/interfaces/user.interface.ts
import { Document } from 'mongoose';

export interface User extends Document {
  email: string;
  password: string;
  phone: string;
  isEmailConfirmed: boolean;
  confirmationToken?: string;
  refreshToken?: string; // Field to store the refresh token
}
