const Router = require('express');
const router = new Router();
const hallsController = require('../controllers/hallsController');

router.get('/', hallsController.getAll);
router.get('/:id', hallsController.getOne);
router.post('/', hallsController.create);
router.put('/:id', hallsController.update);
router.delete('/:id', hallsController.delete);
router.get('/:id/seats', hallsController.getSeatsByHallId);
module.exports = router;
