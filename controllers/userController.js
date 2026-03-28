import User from "../models/User.js";

// @desc    Get top 10 users for leaderboard
// @route   GET /api/users/leaderboard
// @access  Public
export const getLeaderboard = async (req, res) => {
  try {
    // Fetch top 10 users by totalCorrect, excluding passwords/sensitive info
    const topUsers = await User.find({ isActive: true })
      .sort({ totalCorrect: -1, totalVotes: 1 }) // Tie-break with fewer votes (efficiency)
      .limit(10)
      .select("name firstName totalCorrect totalVotes");

    // Add a points calculation (10 per win) for the UI
    const leaderboard = topUsers.map((user, index) => ({
      rank: index + 1,
      name: user.firstName ? `${user.firstName} ${user.name.charAt(0)}.` : user.name,
      points: user.totalCorrect * 10,
      accuracy: user.totalVotes > 0 ? ((user.totalCorrect / user.totalVotes) * 100).toFixed(1) : 0,
    }));

    res.json({ success: true, leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
