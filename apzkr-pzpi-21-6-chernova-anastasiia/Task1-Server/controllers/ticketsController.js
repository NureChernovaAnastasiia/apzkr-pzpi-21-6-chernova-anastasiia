const { Ticket, Schedule, Basket, Seat } = require('../models/models');
const ApiError = require('../error/ApiError');

class TicketsController {
    async getAll(req, res, next) {
        try {
            const tickets = await Ticket.findAll({
                include: [Schedule, Basket, Seat]
            });

            const totalPrice = tickets.reduce((acc, ticket) => acc + parseFloat(ticket.price), 0);

            return res.json({ tickets, total_price: totalPrice });
        } catch (error) {
            next(ApiError.internal('Error fetching tickets'));
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const ticket = await Ticket.findOne({
                where: { id },
                include: [Schedule, Basket, Seat]
            });
            if (!ticket) {
                return next(ApiError.badRequest(`Ticket with id ${id} not found`));
            }
            return res.json(ticket);
        } catch (e) {
            next(ApiError.internal('Error fetching ticket'));
        }
    }

    async create(req, res, next) {
        try {
            const { scheduleId, basketId, seatId, price } = req.body;
            if (!scheduleId || !basketId || !seatId || !price) {
                return res.status(400).json({ message: 'All fields are required' });
            }
            const purchaseDate = new Date();
            const ticket = await Ticket.create({ scheduleId, basketId, seatId, purchaseDate, price });
            return res.json(ticket);
        } catch (e) {
            next(ApiError.internal('Error creating ticket'));
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { scheduleId, basketId, seatId, price } = req.body;
            const ticket = await Ticket.findOne({ where: { id } });
            if (!ticket) {
                return next(ApiError.badRequest(`Ticket with id ${id} not found`));
            }
            ticket.scheduleId = scheduleId || ticket.scheduleId;
            ticket.basketId = basketId || ticket.basketId;
            ticket.seatId = seatId || ticket.seatId;
            ticket.price = price || ticket.price;
            await ticket.save();
            return res.json(ticket);
        } catch (e) {
            next(ApiError.internal('Error updating ticket'));
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const ticket = await Ticket.findOne({ where: { id } });
            if (!ticket) {
                return next(ApiError.badRequest(`Ticket with id ${id} not found`));
            }
            await ticket.destroy();
            return res.json({ message: 'Ticket deleted' });
        } catch (e) {
            next(ApiError.internal('Error deleting ticket'));
        }
    }

}
module.exports = new TicketsController();
