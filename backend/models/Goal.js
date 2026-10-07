import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    targetValue: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ['weekly_distance', 'weekly_count'],
      required: true,
    },
    unit: {
      type: String,
      default: 'km',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Goal = mongoose.model('Goal', goalSchema);
export default Goal;
