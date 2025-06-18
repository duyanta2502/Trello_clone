import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from '~/routes/v1/boardRoute'

const router = express.Router()

router.get('/status', (req, res ) => {
  res.status(StatusCodes.OK).json( { message: 'API v1 is running' })
})
router.use('/boards', boardRoute)

export const APIs_V1 = router