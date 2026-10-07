import express from 'express';
import {
  createActivity,
  getActivities,
  getActivityById,
  deleteActivity,
} from '../controllers/activityController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, createActivity)
  .get(protect, getActivities);

router.route('/:id')
  .get(protect, getActivityById)
  .delete(protect, deleteActivity);

export default router;
