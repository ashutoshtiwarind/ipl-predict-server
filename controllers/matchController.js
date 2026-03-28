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
export const seedMatches = async (req, res) => {
    const defaultMatches = [
        {
            matchNumber: 1,
            team1: { name: 'CSK', fullName: 'Chennai Super Kings', color: '#FDB913', logo: '🦁' },
            team2: { name: 'RCB', fullName: 'Royal Challengers Bangalore', color: '#E02020', logo: '🔴' },
            venue: 'MA Chidambaram Stadium',
            city: 'Chennai',
            matchDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
            status: 'upcoming',
            ai: {
                predictedWinner: 'CSK',
                probability: 68,
                reasoning: [
                    "CSK has won 8/10 home matches at Chepauk this season",
                    "MS Dhoni's finishing ability gives CSK a late-innings edge",
                    "RCB's top order has struggled vs spin — CSK's spin attack is lethal here",
                    "Head-to-head: CSK leads 18–12 all-time vs RCB",
                ],
            },
            seedVotes: { team1: 104200, team2: 61400 },
        },
        {
            matchNumber: 2,
            team1: { name: 'MI', fullName: 'Mumbai Indians', color: '#005DA0', logo: '🔵' },
            team2: { name: 'DC', fullName: 'Delhi Capitals', color: '#17449B', logo: '🔷' },
            venue: 'Arun Jaitley Stadium',
            city: 'Delhi',
            matchDate: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),
            status: 'upcoming',
            ai: {
                predictedWinner: 'MI',
                probability: 61,
                reasoning: [
                    "Mumbai Indians have the strongest batting lineup this season",
                    "Rohit Sharma averaging 52+ in away matches",
                    "MI's bowling attack has taken most wickets in powerplay",
                    "DC missing key player due to injury",
                ],
            },
            seedVotes: { team1: 89500, team2: 55200 },
        },
        {
            matchNumber: 3,
            team1: { name: 'KKR', fullName: 'Kolkata Knight Riders', color: '#3A225D', logo: '♟️' },
            team2: { name: 'SRH', fullName: 'Sunrisers Hyderabad', color: '#FC4E10', logo: '🌅' },
            venue: 'Eden Gardens',
            city: 'Kolkata',
            matchDate: new Date(Date.now() + 50 * 60 * 60 * 1000).toISOString(),
            status: 'upcoming',
            ai: {
                predictedWinner: 'SRH',
                probability: 54,
                reasoning: [
                    "SRH has the best run rate in the tournament",
                    "KKR's middle order has been inconsistent",
                    "Hyderabad's pace battery effective on this pitch",
                    "SRH won last 3 encounters against KKR",
                ],
            },
            seedVotes: { team1: 72100, team2: 78300 },
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
