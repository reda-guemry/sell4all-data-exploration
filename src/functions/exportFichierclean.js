const fs = require("fs");
const path = require("path");


function exportFichierClean(data, outputPath) {
  const cleanedRows = data.map((row) => ({
    Country: row.Country,
    Age: row.Age,
    Gender: row.Gender,
    "Customer spendings": row["Customer spendings"],
  }));

  const csvHeader = ["Country", "Age", "Gender", "Customer spendings"];
  const csvRows = cleanedRows.map((row) =>
    [row.Country, row.Age, row.Gender, row["Customer spendings"]].join(",")
  );
  const csvContent = [csvHeader.join(","), ...csvRows].join("\n");

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, csvContent, "utf-8");

  return outputPath;
}

module.exports = exportFichierClean;
