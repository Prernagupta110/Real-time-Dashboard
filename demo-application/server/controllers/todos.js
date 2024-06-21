import { Router } from 'express'
const todosRouter = Router()
import todoObject from '../data/todos.json' assert { type: 'json' }

todosRouter.get('/', (req, res) => {
    setTimeout( () => {
        res.json(todoObject.todos)
    }, 100)
})
  
todosRouter.get('/:id', (req, res) => {
    const id = req.params.id
    const todo = todoObject.todos.find(todo => todo.id == id)
    if (!todo) {
        return res.status(400).json({ 
            error: 'invalid id' 
        })
    }
    res.json(todo)
})
  
todosRouter.post('/', (req, res) => {
    const body = req.body
  
    if (!body.description) {
      return res.status(400).json({ 
        error: 'description missing' 
      })
    }

    if (!body.status) {
        return res.status(400).json({ 
          error: 'status missing' 
        })
      }
  
    const date = new Date()
  
    const newTodo = {
      id: todoObject.todos.length + 1,
      description: body.description,
      created: date.toLocaleString('fi-FI'),
      status: body.status
    }
  
    todoObject.todos.push(newTodo)
  
    res.json(newTodo)
})
  
todosRouter.delete('/:id', (req, res) => {
    const id = req.params.id
    todoObject.todos = todoObject.todos.filter(todo => todo.id != id)
    res.status(204).end()
})
  
todosRouter.put('/:id', (req, res) => {
    const id = req.params.id
    const body = req.body

    const oldTodo = todoObject.todos.find(todo => todo.id == id)

    if (!oldTodo) {
        return res.status(400).json({ 
            error: 'invalid id' 
        })
    }

    const newTodo = {
        id: oldTodo.id,
        description: body.description,
        created: oldTodo.created,
        status: body.status
    }

    todoObject.todos = todoObject.todos.map(todo => todo.id != id ? todo : newTodo ) 
    res.status(202).end()
})

export { todosRouter }
