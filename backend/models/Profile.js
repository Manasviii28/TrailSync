import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    age: {
      type: Number,
      default: 25,
    },
    height: {
      type: Number, // in cm
      default: 175,
    },
    weight: {
      type: Number, // in kg
      default: 70,
    },
    fitnessGoal: {
      type: String,
      default: 'Improve general physical fitness & endurance',
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
