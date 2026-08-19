const fs = require('fs') 
const { parse } = require('csv-parse/sync')

const csvFile = fs.readFileSync('data/dataset-sell4all.csv' , 'utf-8')

const data = parse(csvFile, {
    columns: true, 
    skipEmptyLines: true
})

console.log('First 5 rows of the dataset: ')
console.log(data.slice(0, 5))

console.log('\nNumber of rows in the dataset: ' , data.length) 

console.log('\nColumns: ');
console.log(Object.keys(data[0])) ; 

















