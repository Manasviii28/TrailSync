import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['distance', 'count'],
      required: true,
    },
    targetValue: {
      type: Number,
      required: true,
    },
    activityType: {
      type: String,
      enum: ['Walking', 'Running', 'Cycling', 'All'],
      default: 'All',
    },
    durationDays: {
      type: Number,
      default: 7,
    },
    icon: {
      type: String,
      default: 'trophy',
    },
  },
  {
    timestamps: true,
  }
);

const Challenge = mongoose.model('Challenge', challengeSchema);
export default Challenge;
