import { Schema, model } from "mongoose";

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  image: String,
  description: String,
  active: { type: Boolean, default: true }
}, { timestamps: true });

export default model("Category", categorySchema);
