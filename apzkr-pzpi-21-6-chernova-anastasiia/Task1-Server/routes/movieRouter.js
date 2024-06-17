const Router = require('express');
const router = new Router();
const movieController = require('../controllers/movieController');
const checkRole = require('../middleware/checkRoleMiddleware')

router.get('/', movieController.getAll);
router.get('/:id', movieController.getOne);
router.post('/', checkRole ('ADMIN'), movieController.create); // Для адміністраторів
router.put('/:id', checkRole ('ADMIN'), movieController.update); // Для адміністраторів
router.delete('/:id', checkRole ('ADMIN'), movieController.delete); // Для адміністраторів

module.exports = router;