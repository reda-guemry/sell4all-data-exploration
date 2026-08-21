const http = require("http");
const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");

const calculateSpendingsByCountry = require("./functions/calculateSpendingsByCountry");
const calculateMedian = require("./functions/calculateMedian");
const calculateMoyenne = require("./functions/calculateMoyene");
const groupAgesByCountry = require("./functions/groupAgesByCountry");
const removeDuplicates = require("./functions/removeDuplicates");
const deleteSpendingless = require("./functions/deleteSpendingless");
const sendJson = require("./reponse/sendJson");
const sendFile = require("./reponse/sendFile");

const ROOT_DIR = path.join(__dirname, "..");
const DATA_PATH = path.join(ROOT_DIR, "data", "dataset-sell4all.csv");
const CLEANED_PATH = path.join(ROOT_DIR, "output", "cleaned_dataset.csv");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".csv": "text/csv; charset=utf-8",
};

function loadNumericData() {
  const csvFile = fs.readFileSync(DATA_PATH, "utf-8");
  const data = parse(csvFile, {
    columns: true,
    skipEmptyLines: true,
  });

  data.forEach((row) => {
    row.Age = Number(row.Age);
    row["Customer spendings"] = Number(row["Customer spendings"]);
  });

  return data;
}


function servePublicFile(res, pathname) {
  const requestedPath = pathname === "/" ? "/index.html" : pathname;
  const resolvedPath = path.normalize(path.join(PUBLIC_DIR, requestedPath));

  if (!resolvedPath.startsWith(PUBLIC_DIR)) {
    res.statusCode = 403;
    res.end("Forbidden");
    return;
  }

  const ext = path.extname(resolvedPath);
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  sendFile(res, resolvedPath, contentType);
}

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  try {
    if (pathname === "/api/kpis") {
      const data = loadNumericData();
      const countries = new Set(data.map((row) => row.Country));

      sendJson(res, {
        totalCustomers: data.length,
        averageAge: calculateMoyenne(data.map((row) => row.Age)),
        medianAge: calculateMedian(data.map((row) => row.Age)),
        averageSpendings: calculateMoyenne(
          data.map((row) => row["Customer spendings"])
        ),
        medianSpendings: calculateMedian(
          data.map((row) => row["Customer spendings"])
        ),
        countries: countries.size,
      });
      return;
    }

    if (pathname === "/api/countries/spendings") {
      const data = loadNumericData();
      sendJson(res, calculateSpendingsByCountry(data));
      return;
    }

    if (pathname === "/api/countries/median-age") {
      const data = loadNumericData();
      const agesByCountry = groupAgesByCountry(data);
      const medianAgeByCountry = {};

      Object.entries(agesByCountry).forEach(([country, ages]) => {
        medianAgeByCountry[country] = calculateMedian(ages);
      });

      sendJson(res, medianAgeByCountry);
      return;
    }

    if (pathname === "/api/dataset/overview") {
      const data = loadNumericData();
      const afterSpendingFilter = deleteSpendingless(data);
      const afterDuplicates = removeDuplicates(afterSpendingFilter);

      sendJson(res, {
        originalRows: data.length,
        rowsAfterSpendingFilter: afterSpendingFilter.length,
        rowsAfterDuplicates: afterDuplicates.length,
        finalCleanedRows: afterDuplicates.length,
        exportedColumns: 4,
      });
      return;
    }

    if (pathname === "/download/cleaned-dataset") {
      sendFile(
        res,
        CLEANED_PATH,
        "text/csv; charset=utf-8",
        "cleaned_dataset.csv"
      );
      return;
    }

    if (pathname.startsWith("/api/")) {
      sendJson(res, { error: "Not found" }, 404);
      return;
    }

    servePublicFile(res, pathname);
  } catch (error) {
    console.error(error);
    sendJson(res, { error: "Internal server error" }, 500);
  }
});

server.listen(10000, () => {
  console.log("Server is running on http://localhost:10000");
});
