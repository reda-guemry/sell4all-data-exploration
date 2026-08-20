const http = require("http");
const fs = require("fs");
const { parse } = require("csv-parse/sync");

const calculateMedian = require("./functions/calculateMedian");
const calculateMoyenne = require("./functions/calculateMoyene");
const groupAgesByCountry = require("./functions/groupAgesByCountry");
const calculateSpendingsByCountry = require("./functions/calculateSpendingsByCountry");

const server = http.createServer((req, res) => {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.url === "/") {
    res.end("Welcome to the API");
  }

  if (req.url === "/api/countries/spendings") {
    const csvFile = fs.readFileSync("data/dataset-sell4all.csv", "utf-8");

    const data = parse(csvFile, {
      columns: true,
      skipEmptyLines: true,
    });

    let agesByCountry = groupAgesByCountry(data);

    

    Object.entries(agesByCountry).forEach(([country, ages]) => {
        agesByCountry[country] = calculateMoyenne(ages) ; 
    });

    res.setHeader("Content-Type", "application/json");

    res.end(JSON.stringify(agesByCountry)) ;

  }
});

server.listen(10000, () => {
  console.log("Server is running on port 10000");
});

// console.log('First 5 rows of the dataset: ')
// console.log(data.slice(0, 5))

// console.log('\nNumber of rows in the dataset: ' , data.length)

// console.log('\nColumns: ');
// console.log(Object.keys(data[0])) ;

// console.log('\nData types of each column: ')

// Object.keys(data[0]).forEach(column => {
//     const value = data[0][column]
//     console.log(`${column} : ${typeof value}`);
// })

// console.log('\nAverage age of customers: ' , calculateMoyenne(data.map(row => row.Age ))) ;
// console.log('\nMedian of customer ages: ' , calculateMedian(data.map(row => row.Age ))) ;

// console.log('\nAverage customer spendings: ' , calculateMoyenne(data.map(row => row['Customer spendings']))) ;
// console.log('\nMedian of customer spendings: ' , calculateMedian(data.map(row => row['Customer spendings']))) ;

// Object.entries(groupAgesByCountry(data)).forEach(([country, ages]) => {
//   console.log(`Median of customer ages in ${country}: `, calculateMedian(ages));
// });

// console.log('\nTotal customer spendings by country: ' , calculateSpendingsByCountry(data)) ;

// data.forEach((row) => {
    //   row.Age = Number(row.Age);
    //   row["Customer spendings"] = Number(row["Customer spendings"]);
    // });


    