import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const MOCK_USERS = [
  { firstName: 'Ashutosh', name: 'Tiwari', email: 'ashutosh@example.com', password: 'password123', totalCorrect: 45, totalVotes: 50 },
  { firstName: 'Virat', name: 'Kohli', email: 'v.kohli@example.com', password: 'password123', totalCorrect: 38, totalVotes: 42 },
  { firstName: 'MS', name: 'Dhoni', email: 'msd@example.com', password: 'password123', totalCorrect: 35, totalVotes: 36 },
  { firstName: 'Rohit', name: 'Sharma', email: 'hitman@example.com', password: 'password123', totalCorrect: 32, totalVotes: 40 },
  { firstName: 'Pat', name: 'Cummins', email: 'pat.c@example.com', password: 'password123', totalCorrect: 28, totalVotes: 30 },
  { firstName: 'Hardik', name: 'Pandya', email: 'hp@example.com', password: 'password123', totalCorrect: 25, totalVotes: 35 },
  { firstName: 'Shubman', name: 'Gill', email: 'gill@example.com', password: 'password123', totalCorrect: 22, totalVotes: 25 },
  { firstName: 'KL', name: 'Rahul', email: 'klr@example.com', password: 'password123', totalCorrect: 20, totalVotes: 28 },
  { firstName: 'Sanju', name: 'Samson', email: 'sanju@example.com', password: 'password123', totalCorrect: 18, totalVotes: 20 },
  { firstName: 'Rishabh', name: 'Pant', email: 'pant@example.com', password: 'password123', totalCorrect: 15, totalVotes: 25 },
];

async function seedLeaders() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🚀 Connected to MongoDB for seeding leaders');

    // Clear existing mock users if needed, or just insert
    // For safety, we only insert if they don't exist
    for (const u of MOCK_USERS) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        await User.create(u);
        console.log(`✅ Created user: ${u.firstName}`);
      }
    }

    console.log('🏆 Leaderboard seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding leaders:', error);
    process.exit(1);
  }
}

seedLeaders();
