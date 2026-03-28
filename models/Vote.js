import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
    },
    selectedTeam: {
      type: String,
      required: true,                      // e.g. "CSK" or "RCB"
    },
    isCorrect: {
      type: Boolean,
      default: null,                       // filled in when match completes
    },
  },
  { timestamps: true }
);

// ─── One vote per user per match ──────────────────────────────────────────────
voteSchema.index({ user: 1, match: 1 }, { unique: true });

const Vote = mongoose.model("Vote", voteSchema);
export default Vote;
