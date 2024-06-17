const { Order } = require('../models/models');
const ApiError = require('../error/ApiError');

class OrderController {
  async getAll(req, res, next) {
    try {
      const orders = await Order.findAll();
      return res.json(orders);
    } catch (e) {
      next(ApiError.internal('Error fetching orders'));
    }
  }

  async getOne(req, res, next) {
    const { id } = req.params;
    try {
      const order = await Order.findByPk(id);
      if (!order) {
        return next(ApiError.badRequest('Order not found'));
      }
      return res.json(order);
    } catch (e) {
      next(ApiError.internal('Error fetching order'));
    }
  }

  async create(req, res, next) {
    const { orderDate, totalAmount } = req.body;
    try {
      const order = await Order.create({ orderDate, totalAmount });
      return res.json(order);
    } catch (e) {
      next(ApiError.internal('Error creating order'));
    }
  }

  async update(req, res, next) {
    const { id } = req.params;
    const { orderDate, totalAmount } = req.body;
    try {
      const order = await Order.findByPk(id);
      if (!order) {
        return next(ApiError.badRequest('Order not found'));
      }
      order.orderDate = orderDate || order.orderDate;
      order.totalAmount = totalAmount || order.totalAmount;
      await order.save();
      return res.json(order);
    } catch (e) {
      next(ApiError.internal('Error updating order'));
    }
  }

  async delete(req, res, next) {
    const { id } = req.params;
    try {
      const order = await Order.findByPk(id);
      if (!order) {
        return next(ApiError.badRequest('Order not found'));
      }
      await order.destroy();
      return res.json({ message: 'Order deleted' });
    } catch (e) {
      next(ApiError.internal('Error deleting order'));
    }
  }
}

module.exports = new OrderController();