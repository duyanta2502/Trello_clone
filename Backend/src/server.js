/* eslint-disable no-unused-vars */
/* eslint-disable no-console*/
import { CONNECT_DB, GET_DB, CLOSE_DB } from '~/config/mongodb'
import express from 'express'
import { mapOrder } from '~/utils/sorts.js'
import exitHook from 'async-exit-hook'
import { env } from '~/config/environment'
const START_SERVER = () => {
  const app = express()

  app.get('/', async(req, res) => {
    // console.log(GET_DB().databaseName)
    console.log(process.env)
    res.end('<h1> hello world <h1/>')
  })
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
    console.log('1. Conncting to MongoDB Cloud Atlas...')
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

