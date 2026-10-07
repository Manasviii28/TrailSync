import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import Challenge from '../models/Challenge.js';
import Activity from '../models/Activity.js';
import connectDB from '../config/db.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing challenges and demo users...');
    await Challenge.deleteMany({});
    
    // Default system challenges
    const sampleChallenges = [
      {
        title: '7-Day Walking Challenge',
        description: 'Walk a total of 20 km over 7 days to boost your daily cardiovascular health and energy.',
        type: 'distance',
        targetValue: 20,
        activityType: 'Walking',
        durationDays: 7,
        icon: 'footprints',
      },
      {
        title: 'Weekend Running Challenge',
        description: 'Run 10 km over the weekend to push your personal stamina to the next level.',
        type: 'distance',
        targetValue: 10,
        activityType: 'Running',
        durationDays: 2,
        icon: 'flame',
      },
      {
        title: 'Active Week Challenge',
        description: 'Complete 5 fitness activities of any kind (walking, running, or cycling) within 7 days.',
        type: 'count',
        targetValue: 5,
        activityType: 'All',
        durationDays: 7,
        icon: 'trophy',
      },
      {
        title: '50 km Cycling Tour',
        description: 'Cycle a total distance of 50 km to build lower body strength and endurance.',
        type: 'distance',
        targetValue: 50,
        activityType: 'Cycling',
        durationDays: 14,
        icon: 'bike',
      },
    ];

    await Challenge.insertMany(sampleChallenges);
    console.log('Sample challenges created successfully!');

    // Create demo community users if they don't exist
    const demoUsers = [
      {
        name: 'Alex Rivera',
        email: 'alex@example.com',
        password: 'password123',
        age: 26,
        height: 178,
        weight: 72,
        fitnessGoal: 'Prepare for 10k marathon',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      },
      {
        name: 'Sarah Chen',
        email: 'sarah@example.com',
        password: 'password123',
        age: 24,
        height: 165,
        weight: 58,
        fitnessGoal: 'Daily 10,000 steps habit',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      },
      {
        name: 'Marcus Johnson',
        email: 'marcus@example.com',
        password: 'password123',
        age: 29,
        height: 182,
        weight: 80,
        fitnessGoal: 'Weekly cycling endurance',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      },
    ];

    for (const u of demoUsers) {
      let user = await User.findOne({ email: u.email });
      if (!user) {
        user = await User.create({
          name: u.name,
          email: u.email,
          password: u.password,
        });

        await Profile.create({
          userId: user._id,
          age: u.age,
          height: u.height,
          weight: u.weight,
          fitnessGoal: u.fitnessGoal,
          avatar: u.avatar,
        });

        console.log(`Created demo user: ${u.name}`);
      }
    }

    console.log('Database seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error.message);
    process.exit(1);
  }
};

seedData();
