import { randomUUID } from 'crypto'
import { Database } from './database.js'
import { buildRoutePath } from '../utils/build-route-path.js'

const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query

            const tasks = database.select('tasks', search ? {
                title: search,
                description: search
            }: null)

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description, completed_at, created_at , updated_at } = req.body

            const task = {
                id: randomUUID(),
                title,   
                description,
                completed_at: false,
                created_at: new Date(),
                updated_at: null
            }
            database.insert('tasks', task)
            return res.writeHead(201).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            try {
                database.delete('tasks', id)
                return res.writeHead(204).end()
            } catch {
                return res.writeHead(404).end()
            }
            

            
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body
            try{
                database.update('tasks', id, {
                    title,
                    description,
                    updated_at: new Date(),
                })
    
                return res.writeHead(204).end()
            } catch {
                return res.writeHead(404).end()
            }
            
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params
            try {
                database.update('tasks', id, {
                    completed_at: true,
                    updated_at: new Date(),
                })
    
                return res.writeHead(204).end()
            } catch {
                return res.writeHead(404).end()
            }
            
        }
    }
]