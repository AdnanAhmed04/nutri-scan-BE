const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: 'Alex Johnson',
    },
    email: {
      type: String,
      required: true,
      default: 'alex.johnson@example.com',
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    },
    age: {
      type: Number,
      default: 24,
    },
    gender: {
      type: String,
      default: 'Male',
    },
    weightKg: {
      type: Number,
      default: 72,
    },
    heightCm: {
      type: Number,
      default: 178,
    },
    dailyCalorieGoal: {
      type: Number,
      default: 2200,
    },
    macroGoals: {
      protein: { type: Number, default: 140 }, // grams
      carbs: { type: Number, default: 250 },   // grams
      fat: { type: Number, default: 65 },       // grams
    },
    waterGoalGlasses: {
      type: Number,
      default: 8,
    },
    waterGlassesToday: {
      type: Number,
      default: 5,
    },
    dietType: {
      type: String,
      enum: ['Balanced', 'High Protein', 'Keto', 'Vegan', 'Vegetarian', 'Low Carb'],
      default: 'Balanced',
    },
    activityLevel: {
      type: String,
      default: 'Moderate',
    },
    streakDays: {
      type: Number,
      default: 7,
    },
    allergies: {
      type: [String],
      default: ['Peanuts'],
    },
    likedFoods: {
      type: [String],
      default: ['Salmon', 'Avocado', 'Greek Yogurt'],
    },
    notifications: {
      nextMeal: { type: Boolean, default: true },
      hydration: { type: Boolean, default: true },
      dailySummary: { type: Boolean, default: true },
      streakReminder: { type: Boolean, default: true },
    },
    // Future Auth Fields
    passwordHash: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      default: 'user',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
