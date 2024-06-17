const Router = require('express');
const router = new Router();
const foodController = require('../controllers/foodController');
const checkRole = require('../middleware/checkRoleMiddleware')

router.get('/', foodController.getAll);
router.post('/', checkRole ('ADMIN'), foodController.create); // Для адміністраторів
router.put('/:id', checkRole ('ADMIN'),  foodController.update); // Для адміністраторів
router.delete('/:id', checkRole ('ADMIN'),  foodController.delete); // Для адміністраторів

module.exports = router;