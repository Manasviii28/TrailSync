import express from 'express';
import {
  getUsers,
  getUserById,
  followUser,
  unfollowUser,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getUsers);
router.get('/:id', protect, getUserById);
router.post('/:id/follow', protect, followUser);
router.delete('/:id/follow', protect, unfollowUser);

export default router;
