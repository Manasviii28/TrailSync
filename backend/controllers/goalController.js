import Goal from '../models/Goal.js';
import Activity from '../models/Activity.js';

// Helper to get start and end of current week (Monday to Sunday)
const getWeekBounds = () => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sun, 1 is Mon
  const distToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  
  const monday = new Date(now);
  monday.setDate(now.getDate() + distToMon);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return { monday, sunday };
};

// @desc    Get all user goals with calculated progress
// @route   GET /api/goals
// @access  Private
export const getGoals = async (req, res, next) => {
  try {
    const goals = await Goal.find({ userId: req.user._id }).sort({ createdAt: -1 });
    const { monday, sunday } = getWeekBounds();

    // Fetch activities recorded this week
    const weeklyActivities = await Activity.find({
      userId: req.user._id,
      createdAt: { $gte: monday, $lte: sunday },
    });

    const weeklyDistance = weeklyActivities.reduce((acc, curr) => acc + (curr.distance || 0), 0);
    const weeklyCount = weeklyActivities.length;

    const goalsWithProgress = goals.map((goal) => {
      const gObj = goal.toObject();
      if (goal.type === 'weekly_distance') {
        gObj.currentValue = parseFloat(weeklyDistance.toFixed(2));
      } else if (goal.type === 'weekly_count') {
        gObj.currentValue = weeklyCount;
      }
      gObj.completed = gObj.currentValue >= gObj.targetValue;
      return gObj;
    });

    res.status(200).json({
      success: true,
      goals: goalsWithProgress,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a personal fitness goal
// @route   POST /api/goals
// @access  Private
export const createGoal = async (req, res, next) => {
  try {
    const { title, targetValue, type, unit } = req.body;

    if (!title || !targetValue || !type) {
      return res.status(400).json({ message: 'Title, target value, and goal type are required' });
    }

    const { monday, sunday } = getWeekBounds();

    const goal = await Goal.create({
      userId: req.user._id,
      title,
      targetValue: Number(targetValue),
      type,
      unit: unit || (type === 'weekly_distance' ? 'km' : 'activities'),
      startDate: monday,
      endDate: sunday,
    });

    res.status(201).json({
      success: true,
      message: 'Fitness goal created successfully',
      goal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a fitness goal
// @route   PUT /api/goals/:id
// @access  Private
export const updateGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    if (goal.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, targetValue } = req.body;
    if (title) goal.title = title;
    if (targetValue) goal.targetValue = Number(targetValue);

    await goal.save();

    res.status(200).json({
      success: true,
      message: 'Goal updated successfully',
      goal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a goal
// @route   DELETE /api/goals/:id
// @access  Private
export const deleteGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    if (goal.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await goal.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Goal deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
