// IPL 2026 Mock Data — replace these with MongoDB queries later
export const matches = [
  {
    id: "match_001",
    matchNumber: 1,
    team1: { name: "CSK", fullName: "Chennai Super Kings", color: "#FDB913", logo: "🦁" },
    team2: { name: "RCB", fullName: "Royal Challengers Bangalore", color: "#E02020", logo: "🔴" },
    venue: "MA Chidambaram Stadium",
    city: "Chennai",
    matchDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hrs from now
    status: "upcoming",
    ai: {
      predictedWinner: "CSK",
      probability: 68,
      reasoning: [
        "CSK has won 8/10 home matches at Chepauk this season",
        "MS Dhoni's finishing ability gives CSK a late-innings edge",
        "RCB's top order has struggled vs spin — CSK's spin attack is lethal here",
        "Head-to-head: CSK leads 18–12 all-time vs RCB",
      ],
    },
    votes: { CSK: 104200, RCB: 61400 },
  },
  {
    id: "match_002",
    matchNumber: 2,
    team1: { name: "MI", fullName: "Mumbai Indians", color: "#005DA0", logo: "🔵" },
    team2: { name: "DC", fullName: "Delhi Capitals", color: "#17449B", logo: "🔷" },
    venue: "Arun Jaitley Stadium",
    city: "Delhi",
    matchDate: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),
    status: "upcoming",
    ai: {
      predictedWinner: "MI",
      probability: 61,
      reasoning: [
        "Mumbai Indians have the strongest batting lineup this season",
        "Rohit Sharma averaging 52+ in away matches",
        "MI's bowling attack has taken most wickets in powerplay",
        "DC missing key player due to injury",
      ],
    },
    votes: { MI: 89500, DC: 55200 },
  },
  {
    id: "match_003",
    matchNumber: 3,
    team1: { name: "KKR", fullName: "Kolkata Knight Riders", color: "#3A225D", logo: "♟️" },
    team2: { name: "SRH", fullName: "Sunrisers Hyderabad", color: "#FC4E10", logo: "🌅" },
    venue: "Eden Gardens",
    city: "Kolkata",
    matchDate: new Date(Date.now() + 50 * 60 * 60 * 1000).toISOString(),
    status: "upcoming",
    ai: {
      predictedWinner: "SRH",
      probability: 54,
      reasoning: [
        "SRH has the best run rate in the tournament",
        "KKR's middle order has been inconsistent",
        "Hyderabad's pace battery effective on this pitch",
        "SRH won last 3 encounters against KKR",
      ],
    },
    votes: { KKR: 72100, SRH: 78300 },
  },
];

// In-memory vote store (replace with MongoDB later)
export const voteStore = new Map();
