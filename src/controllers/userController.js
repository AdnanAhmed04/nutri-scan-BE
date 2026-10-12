const User = require('../models/User');
const { getDBStatus } = require('../config/db');

// In-memory fallback state in case MongoDB is not currently running
let fallbackUser = {
  _id: 'default_user_1',
  name: 'Alex Johnson',
  email: 'alex.johnson@snaptutor.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  age: 24,
  gender: 'Male',
  weightKg: 72,
  heightCm: 178,
  dailyCalorieGoal: 2200,
  macroGoals: {
    protein: 140,
    carbs: 250,
    fat: 65,
  },
  waterGoalGlasses: 8,
  waterGlassesToday: 5,
  dietType: 'Balanced',
  activityLevel: 'Moderate',
  streakDays: 7,
  allergies: ['Peanuts'],
  likedFoods: ['Salmon', 'Avocado', 'Greek Yogurt'],
  notifications: {
    nextMeal: true,
    hydration: true,
    dailySummary: true,
    streakReminder: true,
  },
};

exports.getProfile = async (req, res) => {
  try {
    const { connected } = getDBStatus();
    if (connected) {
      let user = await User.findOne();
      if (!user) {
        user = await User.create(fallbackUser);
      }
      return res.json({ success: true, user, source: 'mongodb' });
    }

    return res.json({ success: true, user: fallbackUser, source: 'memory' });
  } catch (error) {
    console.error('getProfile error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const { connected } = getDBStatus();

    if (connected) {
      let user = await User.findOne();
      if (!user) {
        user = new User(fallbackUser);
      }
      Object.assign(user, updates);
      await user.save();
      return res.json({ success: true, user, source: 'mongodb' });
    }

    fallbackUser = { ...fallbackUser, ...updates };
    return res.json({ success: true, user: fallbackUser, source: 'memory' });
  } catch (error) {
    console.error('updateProfile error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
