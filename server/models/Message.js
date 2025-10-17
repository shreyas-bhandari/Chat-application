import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    username: String,
    text: String,
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
