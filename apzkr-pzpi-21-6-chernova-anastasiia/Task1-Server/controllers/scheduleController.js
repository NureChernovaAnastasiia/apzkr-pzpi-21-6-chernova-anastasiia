const { Schedule, Movie, Hall } = require('../models/models');
const ApiError = require('../error/ApiError');

class ScheduleController {
    async getAll(req, res, next) {
        try {
          const schedules = await Schedule.findAll({
            include: [{ model: Movie }, { model: Hall }]
          });
          return res.json(schedules);
        } catch (e) {
          return next(ApiError.internal(e.message));
        }
      }
      

    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const schedule = await Schedule.findOne({ where: { id } });
            if (!schedule) {
                return next(ApiError.badRequest('Schedule not found'));
            }
            return res.json(schedule);
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    async create(req, res, next) {
        try {
            const { movieId, hallId, startTime, endTime, date } = req.body; 
            if (!movieId || !hallId || !startTime || !endTime || !date) {
                return next(ApiError.badRequest('All fields are required'));
            }
            const schedule = await Schedule.create({ movieId, hallId, startTime, endTime, date }); 
            return res.json(schedule);
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { movieId, hallId, startTime, endTime, date } = req.body;
            const schedule = await Schedule.findOne({ where: { id } });
            if (!schedule) {
                return next(ApiError.badRequest('Schedule not found'));
            }
            schedule.movieId = movieId || schedule.movieId;
            schedule.hallId = hallId || schedule.hallId;
            schedule.startTime = startTime || schedule.startTime;
            schedule.endTime = endTime || schedule.endTime;
            schedule.date = date || schedule.date;
            await schedule.save();
            return res.json(schedule);
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const schedule = await Schedule.findOne({ where: { id } });
            if (!schedule) {
                return next(ApiError.badRequest('Schedule not found'));
            }
            await schedule.destroy();
            return res.json({ message: 'Schedule deleted' });
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }
}

module.exports = new ScheduleController();