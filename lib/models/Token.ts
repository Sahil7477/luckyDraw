import { Schema, model, models } from 'mongoose';

const TokenSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  isWinner: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Token = models.Token || model('Token', TokenSchema);
