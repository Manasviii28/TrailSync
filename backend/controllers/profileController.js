import Profile from '../models/Profile.js';
import User from '../models/User.js';
import Activity from '../models/Activity.js';
import ChallengeParticipation from '../models/ChallengeParticipation.js';
import Follow from '../models/Follow.js';

// @desc    Get user profile with statistics
// @route   GET /api/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    let profile = await Profile.findOne({ userId });

    if (!profile) {
      profile = await Profile.create({ userId });
    }

    // Calculate user aggregate stats
    const activities = await Activity.find({ userId });
    const totalActivities = activities.length;
    const totalDistance = activities.reduce((acc, curr) => acc + (curr.distance || 0), 0);

    const challengesJoined = await ChallengeParticipation.countDocuments({ userId });
    const followers = await Follow.countDocuments({ followingId: userId });
    const following = await Follow.countDocuments({ followerId: userId });

    res.status(200).json({
      success: true,
      profile: {
        ...profile.toObject(),
        name: req.user.name,
        email: req.user.email,
        stats: {
          totalActivities,
          totalDistance: parseFloat(totalDistance.toFixed(2)),
          challengesJoined,
          followers,
          following,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name, age, height, weight, fitnessGoal, avatar } = req.body;

    // Update user name if provided
    if (name) {
      await User.findByIdAndUpdate(userId, { name });
    }

    let profile = await Profile.findOne({ userId });
    if (!profile) {
      profile = new Profile({ userId });
    }

    if (age !== undefined) profile.age = age;
    if (height !== undefined) profile.height = height;
    if (weight !== undefined) profile.weight = weight;
    if (fitnessGoal !== undefined) profile.fitnessGoal = fitnessGoal;
    if (avatar !== undefined) profile.avatar = avatar;

    await profile.save();

    const updatedUser = await User.findById(userId);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile: {
        ...profile.toObject(),
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
};
