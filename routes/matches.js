import express from 'express';
import { getMatches, getMatchById, seedMatches, finishMatch } from '../controllers/matchController.js';

const router = express.Router();

router.get('/', getMatches);
router.get('/seed', seedMatches);
router.put('/:id/finish', finishMatch); // New route for finalized results
router.get('/:id', getMatchById);

export default router;
