import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from '~/routes/v1/boardRoute'
import { columnRoute } from '~/routes/v1/columnRoute'
import { cardRoute } from '~/routes/v1/cardRoute'
const router = express.Router()

router.get('/status', (req, res ) => {
  res.status(StatusCodes.OK).json( { message: 'API v1 is running' })
})
// Board API
router.use('/boards', boardRoute)
// Column API
router.use('/columns', columnRoute)
// Card API
router.use('/cards', cardRoute)
export const APIs_V1 = router