const Router = require('express');
const router = new Router();
const basketsController = require('../controllers/basketsController');

router.get('/:userId', basketsController.getOne);
router.post('/:userId/tickets', basketsController.addTicket);
router.delete('/:userId/tickets/:ticketId', basketsController.removeTicket);

module.exports = router;