const Router = require('express');
const router = new Router();
const orderController = require('../controllers/orderController');
const checkRole = require('../middleware/checkRoleMiddleware')

router.get('/', checkRole ('ADMIN'),  orderController.getAll); // Для адміністраторів
router.get('/:id', orderController.getOne);
router.post('/', orderController.create);
router.put('/:id', checkRole ('ADMIN'),  orderController.update); // Для адміністраторів
router.delete('/:id', checkRole ('ADMIN'),  orderController.delete); // Для адміністраторів

module.exports = router;