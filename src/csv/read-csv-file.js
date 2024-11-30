import { parse } from 'csv-parse';
import fs from 'node:fs'

(async () => {
    fs.createReadStream('src/csv/tasks.csv')
        .pipe(parse({ columns: true, delimiter: ',' }))
        .on('data', function (csvrow) {
            fetch('http://localhost:3333/task', {
                method: 'POST',
                body: JSON.stringify(csvrow),
            }).then(res => {
                return res.text()
            }).then(data => {
                console.log(data)
            })
        })
})();