import { randomUUID } from 'node:crypto'
import { formatISO } from 'date-fns';
import { Database } from './database.js'

const database = new Database()

export class Task {
    constructor({ id = null, title, description, completed_at = null, created_at = null, updated_at = null }) {
        this.id = id ?? randomUUID();
        this.title = title;
        this.description = description;
        this.completed_at = completed_at;
        this.created_at = created_at ?? formatISO(new Date());
        this.updated_at = updated_at
    }

    static create({ title, description }) {
        const task = new Task({
            title,
            description
        })

        database.insert('tasks', task)

        return task;
    }

    static update(id, data) {
        database.update('tasks', id, data)
    }

    static delete(id) {
        database.delete('tasks', id)
    }

    static complete(id) {
        database.complete('tasks', id)
    }

    static get(search) {

        const tasks = database.select('tasks', search || {});

        return tasks;
    }
}