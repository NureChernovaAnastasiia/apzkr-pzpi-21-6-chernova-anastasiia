const express = require('express');
const router = express.Router();
const recommendationService = require('../services/recommendationService');

router.get('/', async (req, res) => {
  try {
    const count = req.query.count ? parseInt(req.query.count) : 3;
    const recommendations = await recommendationService.getRandomMovieRecommendations(count);
    res.json(recommendations);
  } catch (error) {
    console.error('Error fetching movie recommendations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;