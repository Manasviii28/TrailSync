import Challenge from '../models/Challenge.js';
import ChallengeParticipation from '../models/ChallengeParticipation.js';

// @desc    Get all challenges with user participation status
// @route   GET /api/challenges
// @access  Private
export const getChallenges = async (req, res, next) => {
  try {
    const challenges = await Challenge.find().sort({ createdAt: -1 });
    const userParticipations = await ChallengeParticipation.find({ userId: req.user._id });

    const participationMap = {};
    userParticipations.forEach((part) => {
      participationMap[part.challengeId.toString()] = part;
    });

    const challengesWithStatus = challenges.map((ch) => {
      const chObj = ch.toObject();
      const participation = participationMap[ch._id.toString()];

      return {
        ...chObj,
        isJoined: !!participation,
        progress: participation ? parseFloat(participation.progress.toFixed(2)) : 0,
        completed: participation ? participation.completed : false,
        joinedAt: participation ? participation.joinedAt : null,
      };
    });

    res.status(200).json({
      success: true,
      challenges: challengesWithStatus,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Join a challenge
// @route   POST /api/challenges/:id/join
// @access  Private
export const joinChallenge = async (req, res, next) => {
  try {
    const challengeId = req.params.id;
    const challenge = await Challenge.findById(challengeId);

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const existing = await ChallengeParticipation.findOne({
      userId: req.user._id,
      challengeId,
    });

    if (existing) {
      return res.status(400).json({ message: 'Already joined this challenge' });
    }

    const participation = await ChallengeParticipation.create({
      userId: req.user._id,
      challengeId,
      progress: 0,
      completed: false,
    });

    res.status(201).json({
      success: true,
      message: 'Successfully joined challenge',
      participation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Leave a challenge
// @route   DELETE /api/challenges/:id/leave
// @access  Private
export const leaveChallenge = async (req, res, next) => {
  try {
    const challengeId = req.params.id;

    const participation = await ChallengeParticipation.findOne({
      userId: req.user._id,
      challengeId,
    });

    if (!participation) {
      return res.status(404).json({ message: 'Not currently participating in this challenge' });
    }

    await participation.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Successfully left challenge',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my joined challenges
// @route   GET /api/challenges/my
// @access  Private
export const getMyChallenges = async (req, res, next) => {
  try {
    const participations = await ChallengeParticipation.find({ userId: req.user._id })
      .populate('challengeId')
      .sort({ joinedAt: -1 });

    const joined = participations
      .filter((p) => p.challengeId !== null)
      .map((p) => ({
        ...p.challengeId.toObject(),
        participationId: p._id,
        progress: parseFloat(p.progress.toFixed(2)),
        completed: p.completed,
        joinedAt: p.joinedAt,
      }));

    res.status(200).json({
      success: true,
      challenges: joined,
    });
  } catch (error) {
    next(error);
  }
};
