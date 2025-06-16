import { model, models, Schema } from 'mongoose';

const WinnerSchema = new Schema({
  mobile: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export default models.Winner || model('Winner', WinnerSchema);
