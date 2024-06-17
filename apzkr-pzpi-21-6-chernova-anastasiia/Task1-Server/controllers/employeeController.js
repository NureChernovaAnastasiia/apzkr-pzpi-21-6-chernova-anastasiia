const { Employee } = require('../models/models');
const ApiError = require('../error/ApiError');

class EmployeeController { // Метод для отримання всіх співробітників
    async getAll(req, res, next) {
        try {
            const employees = await Employee.findAll();
            res.json(employees);
        } catch (e) {
            next(ApiError.internal('Error retrieving employees'));
        }
    }
    
    // Метод для отримання одного співробітника за id
    async getOne(req, res, next) {
        const { id } = req.params;
        try {
            const employee = await Employee.findByPk(id);
            if (!employee) {
                return next(ApiError.badRequest('Employee not found'));
            }
            res.json(employee);
        } catch (e) {
            next(ApiError.internal('Error retrieving employee'));
        }
    }

     // Метод для створення нового співробітник
    async create(req, res, next) {
        const { role, hireDate, photo } = req.body;
        try {
            // Validate input data
            if (!role || !hireDate || !photo) {
                return next(ApiError.badRequest('All fields are required'));
            }
            const employee = await Employee.create({ role, hireDate, photo});
            res.json(employee);
        } catch (e) {
            next(ApiError.internal('Error creating employee'));
        }
    }

    // Метод для оновлення даних співробітника
    async update(req, res, next) {
        const { id } = req.params;
        const { role, hireDate, photo } = req.body;
        try {
            const employee = await Employee.findByPk(id);
            if (!employee) {
                return next(ApiError.badRequest('Employee not found'));
            }
            // Validate input data
            if (!role || !hireDate|| !photo) {
                return next(ApiError.badRequest('All fields are required'));
            }
            employee.role = role;
            employee.hireDate = hireDate;
            employee.photo = photo;
            await employee.save();
            res.json(employee);
        } catch (e) {
            next(ApiError.internal('Error updating employee'));
        }
    }

    async delete(req, res, next) {
        const { id } = req.params;
        try {
            const employee = await Employee.findByPk(id);
            if (!employee) {
                return next(ApiError.badRequest('Employee not found'));
            }
            await employee.destroy();
            res.json({ message: 'Employee deleted' });
        } catch (e) {
            next(ApiError.internal('Error deleting employee'));
        }
    }
}

module.exports = new EmployeeController();
