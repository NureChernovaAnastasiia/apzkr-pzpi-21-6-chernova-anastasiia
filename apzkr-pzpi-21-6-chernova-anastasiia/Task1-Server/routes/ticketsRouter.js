const Router = require('express');
const router = new Router();
const ticketsController = require('../controllers/ticketsController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.get('/', checkRole('ADMIN'), ticketsController.getAll); // Для адміністраторів
router.get('/:id', ticketsController.getOne);
router.post('/', ticketsController.create);
router.put('/:id', checkRole('ADMIN'), ticketsController.update); // Для адміністраторів
router.delete('/:id', checkRole('ADMIN'), ticketsController.delete); // Для адміністраторів

module.exports = router;
