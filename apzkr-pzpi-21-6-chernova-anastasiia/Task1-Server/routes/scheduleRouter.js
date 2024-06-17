const Router = require('express');
const router = new Router();
const scheduleController = require('../controllers/scheduleController');
const checkRole = require('../middleware/checkRoleMiddleware')

router.get('/', scheduleController.getAll);
router.get('/:id', scheduleController.getOne);
router.post('/', checkRole ('ADMIN'),  scheduleController.create); // Для адміністраторів
router.put('/:id', checkRole ('ADMIN'),  scheduleController.update); // Для адміністраторів
router.delete('/:id', checkRole ('ADMIN'),  scheduleController.delete); // Для адміністраторів

module.exports = router;
