const { readFile } = require('fs')

readFile('./data.json', 'utf8', (err, data) => {
    if(err) console.log(err);
    else console.log(JSON.parse(data).Message);
});