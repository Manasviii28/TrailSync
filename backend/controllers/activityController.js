import Activity from '../models/Activity.js';
import Profile from '../models/Profile.js';
import ChallengeParticipation from '../models/ChallengeParticipation.js';
import Challenge from '../models/Challenge.js';
import Goal from '../models/Goal.js';
import { calculateCalories } from '../utils/calorieCalculator.js';

// @desc    Create/Save a new activity
// @route   POST /api/activities
// @access  Private
export const createActivity = async (req, res, next) => {
  try {
    const {
      activityType,
      startTime,
      endTime,
      duration,
      distance,
      pace,
      calories: inputCalories,
      routePoints,
      isManual,
    } = req.body;

    if (!activityType || duration === undefined || distance === undefined) {
      return res.status(400).json({ message: 'Activity type, duration, and distance are required' });
    }

    // Get user weight for calorie calculation
    const profile = await Profile.findOne({ userId: req.user._id });
    const userWeight = profile ? profile.weight : 70;

    const calculatedCalories = inputCalories || calculateCalories(activityType, duration, userWeight);

    // Calculate pace if not provided (min/km)
    let calculatedPace = pace;
    if (!calculatedPace && distance > 0) {
      calculatedPace = parseFloat(((duration / 60) / distance).toFixed(2));
    }

    const activity = await Activity.create({
      userId: req.user._id,
      activityType,
      startTime: startTime || new Date(),
      endTime: endTime || new Date(),
      duration,
      distance: parseFloat(Number(distance).toFixed(2)),
      pace: calculatedPace || 0,
      calories: calculatedCalories,
      routePoints: routePoints || [],
      isManual: isManual || false,
    });

    // Update Challenge Participations for this user
    const userParticipations = await ChallengeParticipation.find({
      userId: req.user._id,
      completed: false,
    }).populate('challengeId');

    for (const part of userParticipations) {
      const challenge = part.challengeId;
      if (!challenge) continue;

      const matchesType = challenge.activityType === 'All' || challenge.activityType === activityType;
      if (matchesType) {
        if (challenge.type === 'distance') {
          part.progress += activity.distance;
        } else if (challenge.type === 'count') {
          part.progress += 1;
        }

        if (part.progress >= challenge.targetValue) {
          part.completed = true;
        }
        await part.save();
      }
    }

    res.status(201).json({
      success: true,
      message: 'Activity recorded successfully',
      activity,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user activities
// @route   GET /api/activities
// @access  Private
export const getActivities = async (req, res, next) => {
  try {
    const { type } = req.query;
    const filter = { userId: req.user._id };

    if (type && type !== 'All') {
      filter.activityType = type;
    }

    const activities = await Activity.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: activities.length,
      activities,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single activity by ID
// @route   GET /api/activities/:id
// @access  Private
export const getActivityById = async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    if (activity.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this activity' });
    }

    res.status(200).json({
      success: true,
      activity,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete activity
// @route   DELETE /api/activities/:id
// @access  Private
export const deleteActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    if (activity.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this activity' });
    }

    await activity.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Activity removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
