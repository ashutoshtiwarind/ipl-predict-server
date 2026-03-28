import express from 'express';
import { getMatches, getMatchById, seedMatches } from '../controllers/matchController.js';

const router = express.Router();

router.get('/', getMatches);
router.get('/seed', seedMatches); // Moved above :id
router.get('/:id', getMatchById);

export default router;
