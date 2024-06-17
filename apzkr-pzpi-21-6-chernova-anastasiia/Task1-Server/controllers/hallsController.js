const { Hall, Seat } = require('../models/models');
const ApiError = require('../error/ApiError');

class HallsController {
    // Отримання всіх залів разом із місцями
    async getAll(req, res, next) {
        try {
            const halls = await Hall.findAll({
                include: [
                    {
                        model: Seat,
                        attributes: ['id', 'rowNumber', 'seatNumber']
                    }
                ]
            });
            return res.json(halls);
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    // Отримання конкретного залу за id разом із місцями
    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const hall = await Hall.findOne({
                where: { id },
                include: [
                    {
                        model: Seat,
                        attributes: ['id', 'rowNumber', 'seatNumber']
                    }
                ]
            });
            if (!hall) {
                return next(ApiError.badRequest(`Hall with id ${id} not found`));
            }
            return res.json(hall);
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    // Створення нового залу
    async create(req, res, next) {
        try {
            const { name, totalSeats } = req.body;
            // Валідація вхідних даних
            if (!name || !totalSeats) {
                return next(ApiError.badRequest('All fields are required'));
            }
            if (!Number.isInteger(totalSeats) || totalSeats <= 0) {
                return next(ApiError.badRequest('Total seats must be a positive integer'));
            }
            const hall = await Hall.create({ name, totalSeats });
            return res.json(hall);
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    // Оновлення існуючого залу
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { name, totalSeats } = req.body;
            const hall = await Hall.findOne({ where: { id } });
            if (!hall) {
                return next(ApiError.badRequest(`Hall with id ${id} not found`));
            }
            hall.name = name || hall.name;
            if (totalSeats) {
                if (!Number.isInteger(totalSeats) || totalSeats <= 0) {
                    return next(ApiError.badRequest('Total seats must be a positive integer'));
                }
                hall.totalSeats = totalSeats;
            }
            await hall.save();
            return res.json(hall);
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    // Видалення залу
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const hall = await Hall.findOne({ where: { id } });
            if (!hall) {
                return next(ApiError.badRequest(`Hall with id ${id} not found`));
            }
            await hall.destroy();
            return res.json({ message: 'Hall deleted' });
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    // Отримання місць за id залу
    async getSeatsByHallId(req, res, next) {
        try {
            const { id } = req.params;
            const hall = await Hall.findOne({
                where: { id },
                include: [
                    {
                        model: Seat,
                        attributes: ['id', 'rowNumber', 'seatNumber']
                    }
                ]
            });
            if (!hall) {
                return next(ApiError.badRequest(`Hall with id ${id} not found`));
            }
            const seats = hall.Seats;
            return res.json(seats);
        } catch (e) {
            console.error("Error fetching seats:", e);
            return next(ApiError.internal(e.message));
        }
    }
}

module.exports = new HallsController();
