const Router = require('express');
const router = new Router();
const reviewsController = require('../controllers/reviewsController');

router.post('/', reviewsController.create);
router.delete('/:id', reviewsController.delete);
router.get('/', reviewsController.getAll);

module.exports = router;