
const fs = require("fs");
const { parse } = require("csv-parse/sync");


const removeDuplicates = require("./removeDuplicates");
const deleteSpendingless = require("./deleteSpendingless");

const csvFile = fs.readFileSync("data/dataset-sell4all.csv", "utf-8");

const data = parse(csvFile, {
  columns: true,
  skipEmptyLines: true,
});

data.forEach((row) => {
  row.Age = Number(row.Age);
  row["Customer spendings"] = Number(row["Customer spendings"]);
});



function exportFichierClean(data) {
    data = data.map((row) => {
        return {
            Country: row.Country , 
            Age: row.Age , 
            Gender: row.Gender ,
            "Customer spendings": row["Customer spendings"] ,
        }
    })

    const csvHeader = [
        "Country",
        "Age",
        "Gender",
        "Customer spendings"
    ]

    const csvRow = data.map ((row) => {
        return [
            row.Country,
            row.Age,
            row.Gender,
            row["Customer spendings"]
        ].join(",") ;
    })

    const csvContent = [csvHeader.join(","), ...csvRow].join('\n') ; 

    try{
        fs.writeFileSync("./output/cleaned_dataset.csv", csvContent , 'utf-8' )
    }catch (err) {
        console.error("Error writing the cleaned dataset to file:", err);
    }


}

let cleanedData = removeDuplicates(data) ; 
cleanedData = deleteSpendingless(cleanedData) ;

exportFichierClean(cleanedData) ;

