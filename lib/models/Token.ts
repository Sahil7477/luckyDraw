// lib/models/Token.ts
import { Schema, model, models } from 'mongoose';

const TokenSchema = new Schema({
  mobile: { type: String, required: true, unique: true },
  isWinner: { type: Boolean, default: true }, // by default, admin entries = winners
  createdAt: { type: Date, default: Date.now },
});

export default models.Token || model('Token', TokenSchema);
