const fs = require('fs') 
const { parse } = require('csv-parse/sync')

const calculateMedian = require('./functions/calculateMedian')
const calculateMoyenne = require('./functions/calculateMoyene') 
const groupAgesByCountry = require('./functions/groupAgesByCountry')
const calculateSpendingsByCountry = require('./functions/calculateSpendingsByCountry')


const csvFile = fs.readFileSync('data/dataset-sell4all.csv' , 'utf-8')

const data = parse(csvFile, {
    columns: true, 
    skipEmptyLines: true
})

data.forEach((row) => {
    row.Age = Number(row.Age) 
    row['Customer spendings'] = Number(row['Customer spendings'])
})

console.log('First 5 rows of the dataset: ')
console.log(data.slice(0, 5))

console.log('\nNumber of rows in the dataset: ' , data.length) 

console.log('\nColumns: ');
console.log(Object.keys(data[0])) ; 


console.log('\nData types of each column: ')

Object.keys(data[0]).forEach(column => {
    const value = data[0][column] 
    console.log(`${column} : ${typeof value}`);    
})


console.log('\nAverage age of customers: ' , calculateMoyenne(data.map(row => row.Age ))) ; 
console.log('\nMedian of customer ages: ' , calculateMedian(data.map(row => row.Age ))) ; 

console.log('\nAverage customer spendings: ' , calculateMoyenne(data.map(row => row['Customer spendings']))) ;
console.log('\nMedian of customer spendings: ' , calculateMedian(data.map(row => row['Customer spendings']))) ;





Object.entries(groupAgesByCountry(data)).forEach(([country , ages ]) => {
    console.log(`Median of customer ages in ${country}: ` , calculateMedian(ages)) ;
})











console.log('\nTotal customer spendings by country: ' , calculateSpendingsByCountry(data)) ;