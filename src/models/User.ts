import mongoose from 'mongoose';
import { User } from '../types';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema<User>({
  id: { type: String, default: () => uuidv4(), unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  apiKey: { type: String, default: () => uuidv4(), unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  if (this.isModified()) {
    this.updatedAt = new Date();
  }
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = mongoose.model<User>('User', userSchema); 