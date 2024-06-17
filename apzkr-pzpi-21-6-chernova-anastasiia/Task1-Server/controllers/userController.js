const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Basket } = require('../models/models');
const ApiError = require('../error/ApiError');

// Функція для генерації JWT токена
const generateJwt = (id, email, role) => {
    return jwt.sign(
        { id, email, role },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    );
};

class UserController {
    // Метод для реєстрації нового користувача
    async registration(req, res, next) {
        try {
            const { email, password, role } = req.body;
            // Перевірка наявності email та пароля
            if (!email || !password) {
                return next(ApiError.badRequest('Некоректний email або пароль'));
            }
            // Перевірка чи користувач з таким email вже існує
            const candidate = await User.findOne({ where: { email } });
            if (candidate) {
                return next(ApiError.badRequest('Користувач з таким email вже існує'));
            }
            // Хешування пароля та створення нового користувача
            const hashPassword = await bcrypt.hash(password, 5);
            const user = await User.create({ email, password: hashPassword, role });
            // Генерація JWT токена
            const token = generateJwt(user.id, user.email, user.role);
            // Створення кошика для користувача
            const basket = await Basket.create({ userId: user.id });
            return res.json({ token });
        } catch (e) {
            next(ApiError.internal('Помилка реєстрації'));
        }
    }

    // Метод для входу користувача
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });
            // Перевірка чи користувач існує
            if (!user) {
                return next(ApiError.internal('Користувача не знайдено'));
            }
            // Перевірка пароля
            let comparePassword = bcrypt.compareSync(password, user.password);
            if (!comparePassword) {
                return next(ApiError.internal('Вказано невірний пароль'));
            }
            // Генерація JWT токена
            const token = generateJwt(user.id, user.email, user.role);
            return res.json({ token });
        } catch (e) {
            next(ApiError.internal('Помилка входу'));
        }
    }

    // Метод для отримання інформації про користувача за його ідентифікатором
    async getUserById(req, res, next) {
        try {
            const { id } = req.params;
            const user = await User.findOne({ where: { id } });
            if (!user) {
                return next(ApiError.badRequest('Користувача не знайдено'));
            }
            return res.json(user);
        } catch (e) {
            next(ApiError.internal('Помилка отримання даних користувача'));
        }
    }

    // Метод для перевірки токена та повернення нового токена
    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role);
        return res.json({ token, role: req.user.role });
    }
    
    // Метод для оновлення інформації про користувача
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { email, password, role } = req.body;
            const user = await User.findOne({ where: { id } });
            if (!user) {
                return next(ApiError.badRequest('Користувача не знайдено'));
            }
            user.email = email || user.email;
            if (password) {
                user.password = await bcrypt.hash(password, 5);
            }
            user.role = role || user.role;
            await user.save();
            return res.json(user);
        } catch (e) {
            next(ApiError.internal('Помилка оновлення'));
        }
    }

    // Метод для видалення користувача
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const user = await User.findOne({ where: { id } });
            if (!user) {
                return next(ApiError.badRequest('Користувача не знайдено'));
            }
            await user.destroy();
            return res.json({ message: 'Користувача видалено' });
        } catch (e) {
            next(ApiError.internal('Помилка видалення'));
        }
    }
}

module.exports = new UserController();
