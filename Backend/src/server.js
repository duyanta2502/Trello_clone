/* eslint-disable no-unused-vars */
/* eslint-disable no-console*/
import { CONNECT_DB, GET_DB, CLOSE_DB } from '~/config/mongodb'
import express from 'express'
import { mapOrder } from '~/utils/sorts.js'
import exitHook from 'async-exit-hook'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'

const START_SERVER = () => {
  const app = express()

  // enable req.body json data
  app.use(express.json())

  // Use APIs v1
  app.use('/v1', APIs_V1)

  // Middleware xử lí lý lỗi
  app.use(errorHandlingMiddleware)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`3. Hi ${env.AUTHOR} Server running at http://${env.APP_HOST}:${env.APP_PORT}/`)
  })

  //clean up trước khi dừng sever
  exitHook( () => {
    console.log('4.Server is shutting down...')
    CLOSE_DB()
    console.log('5.Disconnected from MongoDB Cloud Atlas')
  })
}

(async () => {
  try {
    console.log('1. Connecting to MongoDB Cloud Atlas...')
    await CONNECT_DB()
    console.log('2. Connected to MongoDB Cloud Atlas')
    START_SERVER()
  } catch (error) {
    console.error('Connection failed!', error)
    process.exit(0)
  }
})()

// console.log('Starting server...')
// CONNECT_DB()
//   .then(() => console.log('Connected to MongoDB Cloud Atlas'))
//   .then(() => START_SERVER())
//   .catch(error => {
//     console.error('Connection failed!', error)
//     process.exit(0)
//   })

