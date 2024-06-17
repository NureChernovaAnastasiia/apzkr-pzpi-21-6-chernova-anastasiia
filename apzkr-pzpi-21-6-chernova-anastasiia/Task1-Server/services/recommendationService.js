const { Movie } = require('../models/models');

const { Sequelize } = require('sequelize');

async function getRandomMovieRecommendations(count = 3) {
  try {
    const movieCount = await Movie.count();

    const randomOffset = Math.floor(Math.random() * (movieCount - count));

    const movies = await Movie.findAll({
      order: [Sequelize.fn('RANDOM')],
      limit: count,
      offset: randomOffset
    });

    return movies;
  } catch (error) {
    console.error('Error fetching random movies:', error);
    throw error;
  }
}

module.exports = {
  getRandomMovieRecommendations
};
