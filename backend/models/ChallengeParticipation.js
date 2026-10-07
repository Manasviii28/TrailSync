import mongoose from 'mongoose';

const challengeParticipationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent double joining
challengeParticipationSchema.index({ userId: 1, challengeId: 1 }, { unique: true });

const ChallengeParticipation = mongoose.model('ChallengeParticipation', challengeParticipationSchema);
export default ChallengeParticipation;
