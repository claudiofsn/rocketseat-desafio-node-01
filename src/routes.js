import { Task } from "./task.js"
import { buildRoutePath } from "./utils/build-route-path.js"

export const routes = [
    {
        method: 'POST',
        path: buildRoutePath('/task'),
        handler: async (req, res) => {
            const { title, description } = req.body

            Task.create({
                title,
                description
            })

            return res.writeHead(201).end()
        }
    },
    {
        method: 'GET',
        path: buildRoutePath('/task'),
        handler: (req, res) => {

            const search = req.query

            const tasks = Task.get(search);

            return res
                .end(JSON.stringify(tasks))
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/task/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body

            const tasks = Task.update(id, { title, description });

            return res
                .end(JSON.stringify(tasks))
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/task/:id'),
        handler: (req, res) => {
            const { id } = req.params

            Task.delete(id);

            return res
                .end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/task/:id'),
        handler: (req, res) => {
            const { id } = req.params

            Task.complete(id);

            return res
                .end()
        }
    }
]