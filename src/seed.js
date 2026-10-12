require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Meal = require('./models/Meal');

const seedData = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/snap_tutor';
  console.log(`Connecting to ${uri} to seed data...`);

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB. Clearing previous seed data...');

    await User.deleteMany({});
    await Meal.deleteMany({});

    const user = await User.create({
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
    });

    console.log(`Created sample user: ${user.name}`);

    const today = new Date().toISOString().split('T')[0];

    const sampleMeals = [
      {
        userId: user._id,
        name: 'Avocado Toast & Boiled Eggs',
        mealType: 'breakfast',
        calories: 420,
        protein: 18,
        carbs: 35,
        fat: 22,
        portion: '2 slices & 2 eggs',
        time: '08:15 AM',
        date: today,
      },
      {
        userId: user._id,
        name: 'Grilled Chicken & Quinoa Salad',
        mealType: 'lunch',
        calories: 580,
        protein: 48,
        carbs: 45,
        fat: 16,
        portion: '1 bowl (350g)',
        time: '01:00 PM',
        date: today,
      },
      {
        userId: user._id,
        name: 'Greek Yogurt with Blueberries',
        mealType: 'snack',
        calories: 190,
        protein: 15,
        carbs: 22,
        fat: 4,
        portion: '200g',
        time: '04:30 PM',
        date: today,
      },
    ];

    await Meal.insertMany(sampleMeals);
    console.log(`Seeded ${sampleMeals.length} meals successfully!`);
    console.log('Seeding finished successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedData();
