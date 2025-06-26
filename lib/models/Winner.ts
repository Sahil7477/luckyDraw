import mongoose from "mongoose";

const WinnerSchema = new mongoose.Schema({
  mobile: { type: String, required: true, unique: true },
  token: { type: String, required: true },
});

const Winner = mongoose.models.Winner || mongoose.model("Winner", WinnerSchema);
export default Winner;
