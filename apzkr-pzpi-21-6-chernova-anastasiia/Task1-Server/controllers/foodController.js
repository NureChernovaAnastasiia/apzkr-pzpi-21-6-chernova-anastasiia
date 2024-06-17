const { FoodMenuItem } = require('../models/models');
const ApiError = require('../error/ApiError');

class FoodController {
    // Отримання всіх елементів меню
    async getAll(req, res, next) {
        try {
            const foodMenuItems = await FoodMenuItem.findAll();
            return res.json(foodMenuItems);
        } catch (e) {
            next(ApiError.internal('Error fetching food menu items'));
        }
    }

    // Створення нового елемента меню
    async create(req, res, next) {
        try {
            const { name, description, price, imgURL } = req.body;
            // Валідація вхідних даних
            if (!name || !description || !price || !imgURL) {
                return next(ApiError.badRequest('All fields are required'));
            }
            const foodMenuItem = await FoodMenuItem.create({ name, description, price, imgURL });
            return res.json(foodMenuItem);
        } catch (e) {
            next(ApiError.internal('Error creating food menu item'));
        }
    }

    // Оновлення існуючого елемента меню
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { name, description, price, imgURL } = req.body;
            const foodMenuItem = await FoodMenuItem.findOne({ where: { id } });
            if (!foodMenuItem) {
                return next(ApiError.badRequest(`Food menu item with id ${id} not found`));
            }
            // Валідація вхідних даних
            if (!name || !description || !price || !imgURL) {
                return next(ApiError.badRequest('All fields are required'));
            }
            foodMenuItem.name = name;
            foodMenuItem.description = description;
            foodMenuItem.price = price;
            foodMenuItem.imgURL = imgURL;
            await foodMenuItem.save();
            return res.json(foodMenuItem);
        } catch (e) {
            next(ApiError.internal('Error updating food menu item'));
        }
    }

    // Видалення елемента меню
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const foodMenuItem = await FoodMenuItem.findOne({ where: { id } });
            if (!foodMenuItem) {
                return next(ApiError.badRequest(`Food menu item with id ${id} not found`));
            }
            await foodMenuItem.destroy();
            return res.json({ message: 'Food menu item deleted' });
        } catch (e) {
            next(ApiError.internal('Error deleting food menu item'));
        }
    }
}

module.exports = new FoodController();