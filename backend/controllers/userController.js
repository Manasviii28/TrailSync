import User from '../models/User.js';
import Profile from '../models/Profile.js';
import Follow from '../models/Follow.js';
import Activity from '../models/Activity.js';

// @desc    Get users for search/discover with follow status
// @route   GET /api/users
// @access  Private
export const getUsers = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const { search } = req.query;

    const query = { _id: { $ne: currentUserId } };
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const users = await User.find(query).select('name email createdAt').sort({ name: 1 });
    const userIds = users.map((u) => u._id);

    // Fetch profiles for these users
    const profiles = await Profile.find({ userId: { $in: userIds } });
    const profileMap = {};
    profiles.forEach((p) => {
      profileMap[p.userId.toString()] = p;
    });

    // Fetch following relationships for current user
    const following = await Follow.find({ followerId: currentUserId });
    const followingSet = new Set(following.map((f) => f.followingId.toString()));

    const result = users.map((u) => {
      const uObj = u.toObject();
      const prof = profileMap[u._id.toString()];

      return {
        ...uObj,
        avatar: prof?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        fitnessGoal: prof?.fitnessGoal || 'Fitness Enthusiast',
        isFollowing: followingSet.has(u._id.toString()),
      };
    });

    res.status(200).json({
      success: true,
      users: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user details by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    const targetUser = await User.findById(targetUserId).select('name email createdAt');

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profile = await Profile.findOne({ userId: targetUserId });
    const activities = await Activity.find({ userId: targetUserId });
    const totalActivities = activities.length;
    const totalDistance = activities.reduce((acc, curr) => acc + (curr.distance || 0), 0);

    const isFollowing = !!(await Follow.findOne({
      followerId: req.user._id,
      followingId: targetUserId,
    }));

    const followersCount = await Follow.countDocuments({ followingId: targetUserId });
    const followingCount = await Follow.countDocuments({ followerId: targetUserId });

    res.status(200).json({
      success: true,
      user: {
        ...targetUser.toObject(),
        profile: profile || {},
        stats: {
          totalActivities,
          totalDistance: parseFloat(totalDistance.toFixed(2)),
          followersCount,
          followingCount,
        },
        isFollowing,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Follow a user
// @route   POST /api/users/:id/follow
// @access  Private
export const followUser = async (req, res, next) => {
  try {
    const followerId = req.user._id;
    const followingId = req.params.id;

    if (followerId.toString() === followingId.toString()) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const userToFollow = await User.findById(followingId);
    if (!userToFollow) {
      return res.status(404).json({ message: 'User to follow not found' });
    }

    const existing = await Follow.findOne({ followerId, followingId });
    if (existing) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    await Follow.create({ followerId, followingId });

    res.status(200).json({
      success: true,
      message: `Now following ${userToFollow.name}`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unfollow a user
// @route   DELETE /api/users/:id/follow
// @access  Private
export const unfollowUser = async (req, res, next) => {
  try {
    const followerId = req.user._id;
    const followingId = req.params.id;

    const followRecord = await Follow.findOne({ followerId, followingId });

    if (!followRecord) {
      return res.status(404).json({ message: 'Not following this user' });
    }

    await followRecord.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Unfollowed successfully',
    });
  } catch (error) {
    next(error);
  }
};
