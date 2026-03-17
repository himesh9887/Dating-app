import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    user1: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    user2: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    initiatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    matchedAt: { type: Date, default: Date.now },
    lastMessage: { type: String, default: "" },
    lastMessageAt: { type: Date, default: Date.now },
    lastMessageSender: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true },
);

matchSchema.index({ user1: 1, user2: 1 }, { unique: true });

export default mongoose.model("Match", matchSchema);
