const Router = require('express')
const router = new Router()

const userRouter = require('./userRouter') 
const employeeRouter = require('./employeeRouter') 
const foodRouter = require('./foodRouter') 
const movieRouter = require('./movieRouter') 
const orderRouter = require('./orderRouter') 
const ticketsRouter = require('./ticketsRouter')
const basketsRouter = require('./basketsRouter')
const basketTicketsRouter = require('./basketTicketsRouter')
const hallsRouter = require('./hallsRouter')
const seatsRouter = require('./seatsRouter')
const reviewsRouter = require('./reviewsRouter')
const scheduleRouter = require('./scheduleRouter')
const recommendationsRouter = require('./recommendations');

router.use('/user', userRouter)
router.use('/employee', employeeRouter)
router.use('/food', foodRouter)
router.use('/movie', movieRouter)
router.use('/order', orderRouter)
router.use('/tickets', ticketsRouter) 
router.use('/baskets', basketsRouter) 
router.use('/basketTickets', basketTicketsRouter)
router.use('/halls', hallsRouter)
router.use('/seats', seatsRouter)
router.use('/reviews', reviewsRouter)
router.use('/schedule', scheduleRouter)
router.use('/recomendation', recommendationsRouter);
module.exports = router