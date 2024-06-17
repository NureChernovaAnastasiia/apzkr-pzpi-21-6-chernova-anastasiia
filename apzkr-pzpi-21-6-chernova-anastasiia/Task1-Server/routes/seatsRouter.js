const Router = require('express');
const router = new Router();
const seatsController = require('../controllers/seatsController');

router.get('/', seatsController.getAll);
router.get('/:id', seatsController.getOne);
router.post('/', seatsController.create);
router.put('/:id', seatsController.update);
router.delete('/:id', seatsController.delete);

module.exports = router;
