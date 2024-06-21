import  { Router } from 'express';
const calendarRouter = Router()
import calendarObject from '../data/calendar.json' assert { type: 'json' }

calendarRouter.get('/', (req, res) => {
    res.json(calendarObject.events)
})

calendarRouter.get('/:id', (req, res) => {
    const id = req.params.id
    const event = calendarObject.events.find(event => event.id == id)
    if (!event) {
        return res.status(400).json({ 
            error: 'invalid id' 
        })
    }
    res.json(event)
})

calendarRouter.post('/', (req, res) => {
    const body = req.body

    if (!body.title || !body.date || !body.startTime || !body.endTime) {
        return res.status(400).json({ 
            error: 'title, date or time missing' 
        })
    }

    const newEvent = {
        id: calendarObject.events.length + 1,
        title: body.title,
        description: body.description || "",
        date: body.date,
        startTime: body.startTime,
        endTime: body.endTime
    }

    calendarObject.events.push(newEvent)

    res.json(newEvent)
})

calendarRouter.delete('/:id', (req, res) => {
    const id = req.params.id
    calendarObject.events =calendarObject.events.filter(event => event.id != id)
    res.status(204).end()
})

calendarRouter.put('/:id', (req, res) => {
    const id = req.params.id
    const body = req.body

    const oldEvent = calendarObject.events.find(event => event.id == id)

    if (!oldEvent) {
        return res.status(400).json({ 
            error: 'invalid id' 
        })
    }
    
    const newEvent = {
        id: oldEvent.id,
        title: body.title || oldEvent.title,
        description: body.description || oldEvent.description,
        date: body.date || oldEvent.date,
        startTime: body.starTime || oldEvent.startTime,
        endTime: body.endTime || oldEvent.endTime
    }

    calendarObject.events = calendarObject.events.map(event => event.id != id ? event : newEvent ) 
    res.status(202).end()
})

export { calendarRouter }