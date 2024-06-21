import express from 'express'

const app  = express()

const PORT = 8080

app.use(express.json());

import { todosRouter } from './controllers/todos.js'
import { calendarRouter } from './controllers/calendar.js'
app.use('/todos', todosRouter)
app.use('/calendar', calendarRouter)

app.listen(PORT, function () {
  console.log(`JSON app is running in port ${PORT}`)
})