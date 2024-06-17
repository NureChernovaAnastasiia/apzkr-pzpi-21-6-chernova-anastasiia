const { Basket, BasketTicket } = require('../models/models');
const ApiError = require('../error/ApiError');

class BasketController {
    // Метод для отримання одного кошика за userId
    async getOne(req, res, next) {
        const { userId } = req.params;  // Отримуємо userId з параметрів запиту
        try {
            const basket = await Basket.findOne({
                where: { userId },
                include: { model: BasketTicket }  // Включаємо пов'язані BasketTicket
            });
            if (!basket) {
                return next(ApiError.badRequest('Basket not found'));  // Якщо кошик не знайдено, повертаємо помилку
            }
            return res.json(basket);  // Повертаємо знайдений кошик
        } catch (error) {
            console.error('Error fetching basket:', error);  // Логування помилки
            next(ApiError.internal('An error occurred while fetching the basket'));  // Повертаємо внутрішню помилку сервера
        }
    }

    // Метод для додавання квитка до кошика
    async addTicket(req, res, next) {
        const { userId } = req.params;  // Отримуємо userId з параметрів запиту
        const { ticketId } = req.body;  // Отримуємо ticketId з тіла запиту
        try {
            let basket = await Basket.findOne({ where: { userId } });
            if (!basket) {
                basket = await Basket.create({ userId });  // Якщо кошик не знайдено, створюємо новий
            }
            const basketTicket = await BasketTicket.create({ basketId: basket.id, ticketId });
            return res.json(basketTicket);  // Повертаємо доданий квиток
        } catch (error) {
            console.error('Error adding ticket to basket:', error);  // Логування помилки
            next(ApiError.internal('An error occurred while adding the ticket to the basket'));  // Повертаємо внутрішню помилку сервера
        }
    }

    // Метод для видалення квитка з кошика
    async removeTicket(req, res, next) {
        const { userId, ticketId } = req.params;  // Отримуємо userId і ticketId з параметрів запиту
        try {
            const basket = await Basket.findOne({ where: { userId } });
            if (!basket) {
                return next(ApiError.badRequest('Basket not found'));  // Якщо кошик не знайдено, повертаємо помилку
            }
            const basketTicket = await BasketTicket.findOne({ where: { basketId: basket.id, ticketId } });
            if (!basketTicket) {
                return next(ApiError.badRequest('Ticket not found in basket'));  // Якщо квиток не знайдено, повертаємо помилку
            }
            await basketTicket.destroy();  // Видаляємо квиток
            return res.json({ message: 'Ticket removed from basket' });  // Повертаємо повідомлення про успішне видалення
        } catch (error) {
            console.error('Error removing ticket from basket:', error);  // Логування помилки
            next(ApiError.internal('An error occurred while removing the ticket from the basket'));  // Повертаємо внутрішню помилку сервера
        }
    }
}

module.exports = new BasketController();