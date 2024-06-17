const { Seat, Hall } = require('../models/models');
const ApiError = require('../error/ApiError');

class SeatsController {
    // Метод для отримання всіх місць та підрахунку кількості місць у кожній залі
    async getAll(req, res, next) {
        try {
            const seats = await Seat.findAll();
            const seatCountsByHall = {};
            for (const seat of seats) {
                const hallId = seat.hallId;
                if (!seatCountsByHall[hallId]) {
                    seatCountsByHall[hallId] = 0;
                }
                seatCountsByHall[hallId]++;
            }
            return res.json({ seats, seatCountsByHall });
        } catch (error) {
            next(ApiError.internal('Error retrieving seat list'));
        }
    }

    // Метод для отримання інформації про конкретне місце за його ідентифікатором
    async getOne(req, res, next) {
        const seatId = req.params.id;
        try {
            const seat = await Seat.findByPk(seatId);
            if (!seat) {
                return next(ApiError.badRequest('Seat not found'));
            }
            res.status(200).json(seat);
        } catch (error) {
            next(ApiError.internal('Error retrieving seat'));
        }
    }

    // Метод для створення нового місця. Перевіряє, чи всі обов'язкові поля заповнені, і чи існує вказана зала
    async create(req, res, next) {
        const { rowNumber, seatNumber, hallId } = req.body;
        if (!rowNumber || !seatNumber || !hallId) {
            return next(ApiError.badRequest('Please provide all required fields: rowNumber, seatNumber, and hallId'));
        }

        try {
            const hall = await Hall.findByPk(hallId);
            if (!hall) {
                return next(ApiError.badRequest('Hall not found'));
            }

            const seat = await Seat.create({ rowNumber, seatNumber, hallId });
            res.status(201).json(seat); 
        } catch (error) {
            console.error(error); 
            next(ApiError.internal('Error creating seat'));
        }
    }

    // Метод для оновлення інформації про місце за його ідентифікатором. Перевіряє, чи існує вказана зала
    async update(req, res, next) {
        const seatId = req.params.id;
        const { rowNumber, seatNumber, hallId } = req.body;
        try {
            let seat = await Seat.findByPk(seatId);
            if (!seat) {
                return next(ApiError.badRequest('Seat not found'));
            }
            const hall = await Hall.findByPk(hallId);
            if (!hall) {
                return next(ApiError.badRequest('Hall not found'));
            }
            seat.rowNumber = rowNumber;
            seat.seatNumber = seatNumber;
            seat.hallId = hallId;
            await seat.save();
            res.status(200).json(seat);
        } catch (error) {
            next(ApiError.internal('Error updating seat information'));
        }
    }

    // Метод для видалення місця за його ідентифікатором
    async delete(req, res, next) {
        const seatId = req.params.id;
        try {
            const seat = await Seat.findByPk(seatId);
            if (!seat) {
                return next(ApiError.badRequest('Seat not found'));
            }
            await seat.destroy();
            res.status(204).end();
        } catch (error) {
            next(ApiError.internal('Error deleting seat'));
        }
    }
}    

module.exports = new SeatsController();
