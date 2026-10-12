const Meal = require('../models/Meal');
const User = require('../models/User');
const { getDBStatus } = require('../config/db');

// In-memory fallback initial meals for demo and development without DB
let fallbackMeals = [
  {
    _id: 'm1',
    name: 'Avocado Toast & Boiled Eggs',
    mealType: 'breakfast',
    calories: 420,
    protein: 18,
    carbs: 35,
    fat: 22,
    portion: '2 slices & 2 eggs',
    time: '08:15 AM',
    date: new Date().toISOString().split('T')[0],
  },
  {
    _id: 'm2',
    name: 'Grilled Chicken & Quinoa Salad',
    mealType: 'lunch',
    calories: 580,
    protein: 48,
    carbs: 45,
    fat: 16,
    portion: '1 bowl (350g)',
    time: '01:00 PM',
    date: new Date().toISOString().split('T')[0],
  },
  {
    _id: 'm3',
    name: 'Greek Yogurt with Blueberries',
    mealType: 'snack',
    calories: 190,
    protein: 15,
    carbs: 22,
    fat: 4,
    portion: '200g',
    time: '04:30 PM',
    date: new Date().toISOString().split('T')[0],
  },
];

let fallbackWater = 5;

const calculateTotals = (meals) => {
  return meals.reduce(
    (acc, m) => ({
      calories: acc.calories + (Number(m.calories) || 0),
      protein: acc.protein + (Number(m.protein) || 0),
      carbs: acc.carbs + (Number(m.carbs) || 0),
      fat: acc.fat + (Number(m.fat) || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
};

const groupMeals = (meals) => {
  const groups = { breakfast: [], lunch: [], dinner: [], snack: [] };
  meals.forEach((m) => {
    const key = (m.mealType || 'snack').toLowerCase();
    if (groups[key]) {
      groups[key].push(m);
    } else {
      groups.snack.push(m);
    }
  });
  return groups;
};

exports.getTodayDiet = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { connected } = getDBStatus();

    let meals = [];
    let waterGlasses = fallbackWater;
    let dailyCalorieGoal = 2200;
    let macroGoals = { protein: 140, carbs: 250, fat: 65 };

    if (connected) {
      meals = await Meal.find({ date: today }).sort({ createdAt: -1 });
      const user = await User.findOne();
      if (user) {
        waterGlasses = user.waterGlassesToday;
        dailyCalorieGoal = user.dailyCalorieGoal;
        macroGoals = user.macroGoals;
      }
    } else {
      meals = [...fallbackMeals];
    }

    const totals = calculateTotals(meals);
    const grouped = groupMeals(meals);

    return res.json({
      success: true,
      date: today,
      meals,
      groupedMeals: grouped,
      totals,
      goals: {
        calorieGoal: dailyCalorieGoal,
        remainingCalories: Math.max(0, dailyCalorieGoal - totals.calories),
        macroGoals,
      },
      waterGlassesToday: waterGlasses,
      source: connected ? 'mongodb' : 'memory',
    });
  } catch (error) {
    console.error('getTodayDiet error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.addMeal = async (req, res) => {
  try {
    const { name, mealType, calories, protein, carbs, fat, portion, notes } = req.body;

    if (!name || !mealType || calories === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, mealType, and calories are required',
      });
    }

    const today = new Date().toISOString().split('T')[0];
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMealData = {
      name,
      mealType: mealType.toLowerCase(),
      calories: Number(calories),
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      portion: portion || '1 serving',
      time,
      date: today,
      notes: notes || '',
    };

    const { connected } = getDBStatus();

    if (connected) {
      const savedMeal = await Meal.create(newMealData);
      return res.status(201).json({ success: true, meal: savedMeal, source: 'mongodb' });
    }

    const memoryMeal = {
      _id: 'm_' + Date.now(),
      ...newMealData,
      createdAt: new Date(),
    };
    fallbackMeals.unshift(memoryMeal);

    return res.status(201).json({ success: true, meal: memoryMeal, source: 'memory' });
  } catch (error) {
    console.error('addMeal error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const { connected } = getDBStatus();

    if (connected) {
      await Meal.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Meal deleted successfully', source: 'mongodb' });
    }

    fallbackMeals = fallbackMeals.filter((m) => String(m._id) !== String(id));
    return res.json({ success: true, message: 'Meal deleted successfully', source: 'memory' });
  } catch (error) {
    console.error('deleteMeal error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateWater = async (req, res) => {
  try {
    const { delta } = req.body; // e.g. +1 or -1
    const { connected } = getDBStatus();

    if (connected) {
      let user = await User.findOne();
      if (!user) {
        user = await User.create({});
      }
      user.waterGlassesToday = Math.max(0, (user.waterGlassesToday || 0) + (Number(delta) || 1));
      await user.save();
      return res.json({ success: true, waterGlassesToday: user.waterGlassesToday });
    }

    fallbackWater = Math.max(0, fallbackWater + (Number(delta) || 1));
    return res.json({ success: true, waterGlassesToday: fallbackWater });
  } catch (error) {
    console.error('updateWater error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
