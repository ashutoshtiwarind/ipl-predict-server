import Match from '../models/Match.js';

// @desc    Get all matches
// @route   GET /api/matches
// @access  Public
export const getMatches = async (req, res) => {
    try {
        const matches = await Match.find({}).sort({ matchNumber: 1 });
        res.json({ success: true, matches });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single match
// @route   GET /api/matches/:id
// @access  Public
export const getMatchById = async (req, res) => {
    const { id } = req.params;
    try {
        // Validate ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: 'Invalid Match ID format' });
        }

        const match = await Match.findById(id);
        if (match) {
            res.json({ success: true, match });
        } else {
            res.status(404).json({ success: false, message: 'Match not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Seed matches (for development)
// @route   POST /api/matches/seed
// @access  Private
// @desc    Finish a match and award points
// @route   PUT /api/matches/:id/finish
// @access  Private (Admin)
export const finishMatch = async (req, res) => {
    const { id } = req.params;
    const { winner } = req.body; // e.g., "SRH"

    try {
        const match = await Match.findById(id);
        if (!match) return res.status(404).json({ success: false, message: 'Match not found' });

        if (match.status === 'completed') {
            return res.status(400).json({ success: false, message: 'Match already completed' });
        }

        // 1. Update match status and winner
        match.status = 'completed';
        match.winner = winner;
        await match.save();

        // 2. Find all votes for this match
        const Vote = (await import('../models/Vote.js')).default;
        const User = (await import('../models/User.js')).default;
        
        const votes = await Vote.find({ match: id });

        // 3. Process each vote
        for (const vote of votes) {
            const isCorrect = vote.selectedTeam === winner;
            vote.isCorrect = isCorrect;
            await vote.save();

            if (isCorrect) {
                // Award points/increment totalCorrect for the user
                await User.findByIdAndUpdate(vote.user, { $inc: { totalCorrect: 1 } });
            }
        }

        res.json({ success: true, message: `Match finished! Winner: ${winner}. Points awarded.`, match });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const seedMatches = async (req, res) => {
    // ... Existing seedMatches code ...
    const defaultMatches = [
        {
            matchNumber: 1,
            team1: { name: 'SRH', fullName: 'Sunrisers Hyderabad', color: '#FC4E10', logo: '🌅' },
            team2: { name: 'RCB', fullName: 'Royal Challengers Bangalore', color: '#E02020', logo: '🔴' },
            venue: 'Rajiv Gandhi International Stadium',
            city: 'Hyderabad',
            matchDate: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(), // Starts in 1 hour
            status: 'upcoming',
            ai: {
                predictedWinner: 'SRH',
                probability: 52,
                reasoning: [
                    "SRH's aggressive batting approach has dominated home conditions this season",
                    "RCB's bowling struggles at the death could be exploited by Klaasen and Head",
                    "Head-to-head at this venue: SRH holds a slight 6-4 advantage",
                    "Recent Form: SRH has won 3 of their last 4 matches"
                ],
            },
            seedVotes: { team1: 125400, team2: 138600 },
        },
        {
            matchNumber: 2,
            team1: { name: 'CSK', fullName: 'Chennai Super Kings', color: '#FDB913', logo: '🦁' },
            team2: { name: 'MI', fullName: 'Mumbai Indians', color: '#005DA0', logo: '🔵' },
            venue: 'MA Chidambaram Stadium',
            city: 'Chennai',
            matchDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            status: 'upcoming',
            ai: {
                predictedWinner: 'CSK',
                probability: 65,
                reasoning: [
                    "CSK's spin-heavy attack is masterfully tuned for the Chepauk surface",
                    "MI has historically struggled to adapt to low-scoring tracks at this venue",
                    "Dhoni's tactical awareness in the middle overs remains a decisive factor",
                    "Home crowd advantage provides 15% boost to CSK's win probability"
                ],
            },
            seedVotes: { team1: 185000, team2: 142000 },
        },
        {
            matchNumber: 3,
            team1: { name: 'KKR', fullName: 'Kolkata Knight Riders', color: '#3A225D', logo: '♟️' },
            team2: { name: 'PBKS', fullName: 'Punjab Kings', color: '#D71920', logo: '🦁' },
            venue: 'Eden Gardens',
            city: 'Kolkata',
            matchDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
            status: 'upcoming',
            ai: {
                predictedWinner: 'KKR',
                probability: 58,
                reasoning: [
                    "Eden Gardens' lightning-fast outfield favors KKR's power hitters",
                    "PBKS bowling attack lacks the variety to stifle Narine and Russell",
                    "KKR's mystery spinners are expected to keep the run rate under control",
                    "Historical Trend: KKR has won 70% of night matches at this venue"
                ],
            },
            seedVotes: { team1: 95400, team2: 62300 },
        },
        {
            matchNumber: 4,
            team1: { name: 'DC', fullName: 'Delhi Capitals', color: '#17449B', logo: '🔷' },
            team2: { name: 'GT', fullName: 'Gujarat Titans', color: '#1B2133', logo: '⚡' },
            venue: 'Arun Jaitley Stadium',
            city: 'Delhi',
            matchDate: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
            status: 'upcoming',
            ai: {
                predictedWinner: 'GT',
                probability: 54,
                reasoning: [
                    "GT's balanced composition makes them highly effective in away conditions",
                    "DC's top-order reliance on one player makes them vulnerable to early wickets",
                    "Rashid Khan's record against DC's middle order is exceptional",
                    "GT has a 100% win rate in Delhi over the last two seasons"
                ],
            },
            seedVotes: { team1: 78900, team2: 84200 },
        },
    ];

    try {
        await Match.deleteMany();
        const createdMatches = await Match.insertMany(defaultMatches);
        res.status(201).json({ success: true, matches: createdMatches });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
