import express from 'express';
import {
  getChallenges,
  joinChallenge,
  leaveChallenge,
  getMyChallenges,
} from '../controllers/challengeController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getChallenges);
router.get('/my', protect, getMyChallenges);
router.post('/:id/join', protect, joinChallenge);
router.delete('/:id/leave', protect, leaveChallenge);

export default router;
