const Router = require('express');
const router = new Router();
const employeeController = require('../controllers/employeeController');
const checkRole = require('../middleware/checkRoleMiddleware')

router.get('/', checkRole ('ADMIN'),  employeeController.getAll); // Для адміністраторів
router.get('/:id',checkRole ('ADMIN'),  employeeController.getOne); // Для адміністраторів
router.post('/', checkRole ('ADMIN'),  employeeController.create); // Для адміністраторів
router.put('/:id', checkRole ('ADMIN'),  employeeController.update); // Для адміністраторів
router.delete('/:id', checkRole ('ADMIN'),  employeeController.delete); // Для адміністраторів

module.exports = router;