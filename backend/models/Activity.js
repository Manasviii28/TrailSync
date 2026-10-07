import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    activityType: {
      type: String,
      enum: ['Walking', 'Running', 'Cycling'],
      required: true,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
      default: Date.now,
    },
    duration: {
      type: Number, // duration in seconds
      required: true,
    },
    distance: {
      type: Number, // distance in kilometers
      required: true,
    },
    pace: {
      type: Number, // pace in min/km
      default: 0,
    },
    calories: {
      type: Number, // estimated calories
      required: true,
    },
    routePoints: [
      {
        lat: Number,
        lng: Number,
        timestamp: Date,
      },
    ],
    isManual: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;
