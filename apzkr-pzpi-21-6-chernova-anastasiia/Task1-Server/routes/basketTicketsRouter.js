const Router = require('express');
const router = new Router();
const basketTicketsController = require('../controllers/basketTicketsController');

router.get('/', basketTicketsController.getAll);
router.get('/:id', basketTicketsController.getOne);
router.post('/', basketTicketsController.create);
router.delete('/:id', basketTicketsController.delete);

module.exports = router;
