const { BasketTicket } = require('../models/models');
const ApiError = require('../error/ApiError');

class BasketTicketsController {  // Метод для отримання всіх квитків у кошиках
    async getAll(req, res, next) {
        try {
            const basketTickets = await BasketTicket.findAll();
            return res.json(basketTickets);
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    async getOne(req, res, next) {
        const { id } = req.params;
        try {
            const basketTicket = await BasketTicket.findOne({ where: { id } });
            if (!basketTicket) {
                return next(ApiError.badRequest('Basket ticket not found'));
            }
            return res.json(basketTicket);
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    async create(req, res, next) {
        const { basketId, ticketId } = req.body;
        try {
            const basketTicket = await BasketTicket.create({ basketId, ticketId });
            return res.json(basketTicket);
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    async delete(req, res, next) {
        const { id } = req.params;
        try {
            const basketTicket = await BasketTicket.findOne({ where: { id } });
            if (!basketTicket) {
                return next(ApiError.badRequest('Basket ticket not found'));
            }
            await basketTicket.destroy();
            return res.json({ message: 'Basket ticket deleted' });
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }
}

module.exports = new BasketTicketsController();