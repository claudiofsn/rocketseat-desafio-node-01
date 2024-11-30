import { formatISO } from 'date-fns';
import fs from 'node:fs/promises';
import { URL } from 'node:url';

const databasePath = new URL('../db.json', import.meta.url);

export class Database {
    #database = {};

    constructor() {
        fs.readFile(databasePath, 'utf-8')
            .then(data => {
                this.#database = JSON.parse(data)
            })
            .catch(() => {
                this.#persist()
            })
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database));
    }

    select(table, search) {
        let data = this.#database[table] ?? [];

        if (search) {
            data = data.filter(row => {
                return Object.entries(search).every(([key, value]) => {
                    return row[key]?.toLowerCase().includes(value.toLowerCase());
                });
            });
        }

        return data;
    }

    insert(table, data) {
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data);
        } else {
            this.#database[table] = [data];
        }

        this.#persist();
        return data;
    }

    update(table, id, data) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        const task = this.#database[table][rowIndex]

        task.title = data.title ?? task.title
        task.description = data.description ?? task.description
        task.updated_at = data.updated_at = formatISO(new Date())

        if (rowIndex > -1) {
            this.#database[table][rowIndex] = { id, ...task }
            this.#persist()
        }
    }

    delete(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
        }
    }

    complete(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        const task = this.#database[table][rowIndex]

        task.completed_at = task.completed_at ? null : formatISO(new Date());
        task.updated_at = formatISO(new Date())

        if (rowIndex > -1) {
            this.#database[table][rowIndex] = { id, ...task }
            this.#persist()
        }
    }
}
