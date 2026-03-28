import Vote from '../models/Vote.js';
import Match from '../models/Match.js';

// @desc    Submit a vote
// @route   POST /api/votes
// @access  Private
export const submitVote = async (req, res) => {
    const { matchId, team } = req.body;
    const userId = req.user._id;

    try {
        // Validate ObjectId first to prevent 500 CastError
        if (!matchId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: 'Invalid Match ID format' });
        }

        const match = await Match.findById(matchId);
        if (!match) {
            return res.status(404).json({ success: false, message: 'Match not found' });
        }

        const validTeams = [match.team1.name, match.team2.name];
        if (!validTeams.includes(team)) {
            return res.status(400).json({ success: false, message: `Team must be one of: ${validTeams.join(', ')}` });
        }

        // Check if user already voted
        const existingVote = await Vote.findOne({ user: userId, match: matchId });
        if (existingVote) {
             return res.status(400).json({ success: false, message: 'You already voted for this match' });
        }

        const vote = await Vote.create({
            user: userId,
            match: matchId,
            selectedTeam: team,
        });

        // Get updated stats
        const stats = await getVoteStatsInternal(match);
        res.status(201).json({ success: true, stats });
    } catch (error) {
         if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'You already voted for this match' });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get vote stats for a match
// @route   GET /api/votes/:matchId
// @access  Public
export const getVoteStats = async (req, res) => {
    const { matchId } = req.params;
    try {
        // Validate ObjectId
        if (!matchId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: 'Invalid Match ID format' });
        }

        const match = await Match.findById(matchId);
        if (!match) {
            return res.status(404).json({ success: false, message: 'Match not found' });
        }

        const stats = await getVoteStatsInternal(match);
        res.json({ success: true, stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Helper function to calculate vote stats
async function getVoteStatsInternal(match) {
    const votes = await Vote.find({ match: match._id });

    const team1Name = match.team1.name;
    const team2Name = match.team2.name;

    const team1Votes = votes.filter(v => v.selectedTeam === team1Name).length + match.seedVotes.team1;
    const team2Votes = votes.filter(v => v.selectedTeam === team2Name).length + match.seedVotes.team2;
    const total = team1Votes + team2Votes;

    return {
        [team1Name]: {
            count: team1Votes,
            percentage: total ? ((team1Votes / total) * 100).toFixed(1) : "50.0",
        },
        [team2Name]: {
            count: team2Votes,
            percentage: total ? ((team2Votes / total) * 100).toFixed(1) : "50.0",
        },
        total,
    };
}
