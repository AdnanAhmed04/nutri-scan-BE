const express = require('express');
const router = express.Router();
const dietController = require('../controllers/dietController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/today', authMiddleware, dietController.getTodayDiet);
router.post('/meals', authMiddleware, dietController.addMeal);
router.delete('/meals/:id', authMiddleware, dietController.deleteMeal);
router.post('/water', authMiddleware, dietController.updateWater);

module.exports = router;
