import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    matchNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    team1: {
      name:     { type: String, required: true },   // e.g. "CSK"
      fullName: { type: String, required: true },   // e.g. "Chennai Super Kings"
      color:    { type: String, required: true },   // hex color
      logo:     { type: String, required: true },   // emoji or URL
    },
    team2: {
      name:     { type: String, required: true },
      fullName: { type: String, required: true },
      color:    { type: String, required: true },
      logo:     { type: String, required: true },
    },
    venue:     { type: String, required: true },
    city:      { type: String, required: true },
    matchDate: { type: Date,   required: true },
    status: {
      type: String,
      enum: ["upcoming", "live", "completed"],
      default: "upcoming",
    },
    winner: { type: String, default: null },         // set after match ends
    ai: {
      predictedWinner: { type: String, required: true },
      probability:     { type: Number, required: true, min: 0, max: 100 },
      reasoning:       [{ type: String }],
    },
    // Seed counts for realistic voting numbers before real votes arrive
    seedVotes: {
      team1: { type: Number, default: 0 },
      team2: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const Match = mongoose.model("Match", matchSchema);
export default Match;
