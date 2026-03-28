import express from "express";
import Match from "../models/Match.js";

const router = express.Router();

// GET /api/predictions/:matchId — get AI prediction for a match
router.get("/:matchId", async (req, res) => {
  const { matchId } = req.params;

  try {
    // Validate ObjectId
    if (!matchId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid Match ID format" });
    }

    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ success: false, message: "Match not found" });

    res.json({
      success: true,
      prediction: {
        matchId: match._id,
        predictedWinner: match.ai.predictedWinner,
        probability: match.ai.probability,
        reasoning: match.ai.reasoning,
        generatedAt: match.updatedAt || new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
