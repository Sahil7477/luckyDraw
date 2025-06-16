import { model, models, Schema } from 'mongoose';

const AdminSchema = new Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
});

export default models.Admin || model('Admin', AdminSchema);
