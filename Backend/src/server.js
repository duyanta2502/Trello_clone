import express from 'express'
import { mapOrder } from '~/utils/sorts.js'

const app = express()
const hostname = 'localhost'
const port = 8017

app.get('/', (req, res) => {
  console.log(mapOrder(
    [ { id: 'id-1', name: 'One' },
      { id: 'id-2', name: 'Two' },
      { id: 'id-3', name: 'Three' },
      { id: 'id-4', name: 'Four' },
      { id: 'id-5', name: 'Five' } ],
    ['id-5', 'id-4', 'id-2', 'id-3', 'id-1'],
    'id'
  ))
  res.send('<h1> hello world <h1/>')
})
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})