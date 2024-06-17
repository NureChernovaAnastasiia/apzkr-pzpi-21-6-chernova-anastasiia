const { Movie } = require('../models/models');
const ApiError = require('../error/ApiError');

class MovieController {
    // Отримання всіх фільмів
    async getAll(req, res, next) {
        try {
            const movies = await Movie.findAll();
            return res.json(movies);
        } catch (e) {
            next(ApiError.internal('Error retrieving movies'));
        }
    }

    // Отримання конкретного фільму за id
    async getOne(req, res, next) {
        const { id } = req.params;
        try {
            const movie = await Movie.findByPk(id);
            if (!movie) {
                return next(ApiError.badRequest('Movie not found'));
            }
            return res.json(movie);
        } catch (e) {
            next(ApiError.internal('Error retrieving movie'));
        }
    }

    // Створення нового фільму
    async create(req, res, next) {
        const { title, description, duration, genre, rating, posterURL, trailerURL } = req.body;
        try {
            // Валідація вхідних даних
            if (!title || !duration) {
                return next(ApiError.badRequest('Title and duration are required'));
            }
            const movie = await Movie.create({ title, description, duration, genre, rating, posterURL, trailerURL });
            return res.json(movie);
        } catch (e) {
            next(ApiError.internal('Error creating movie'));
        }
    }

    // Оновлення існуючого фільму
    async update(req, res, next) {
        const { id } = req.params;
        const { title, description, duration, genre, rating, posterURL, trailerURL } = req.body;
        try {
            const movie = await Movie.findByPk(id);
            if (!movie) {
                return next(ApiError.badRequest('Movie not found'));
            }
            if (!title || !duration) {
                return next(ApiError.badRequest('Title and duration are required'));
            }
            movie.title = title;
            movie.description = description;
            movie.duration = duration;
            movie.genre = genre;
            movie.rating = rating;
            movie.posterURL = posterURL;
            movie.trailerURL = trailerURL;
            await movie.save();
            return res.json(movie);
        } catch (e) {
            next(ApiError.internal('Error updating movie'));
        }
    }

    // Видалення фільму
    async delete(req, res, next) {
        const { id } = req.params;
        try {
            const movie = await Movie.findByPk(id);
            if (!movie) {
                return next(ApiError.badRequest('Movie not found'));
            }
            await movie.destroy();
            return res.json({ message: 'Movie deleted' });
        } catch (e) {
            next(ApiError.internal('Error deleting movie'));
        }
    }
}

module.exports = new MovieController();
