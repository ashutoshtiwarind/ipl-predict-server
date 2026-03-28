import express from 'express';
import { submitVote, getVoteStats } from '../controllers/voteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, submitVote); // Protected route
router.get('/:matchId', getVoteStats);

export default router;
