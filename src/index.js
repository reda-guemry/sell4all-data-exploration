const http = require("http");
const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");

const calculateSpendingsByCountry = require("./functions/calculateSpendingsByCountry");
const calculateMedian = require("./functions/calculateMedian");
const calculateMoyenne = require("./functions/calculateMoyene");
const calculateAgeDistribution = require("./functions/calculateAgeDistribution");
const groupAgesByCountry = require("./functions/groupAgesByCountry");
const deleteSpendingless = require("./functions/deleteSpendingless");
const removeDuplicates = require("./functions/removeDuplicates");
const exportFichierClean = require("./functions/exportFichierclean");
const sendJson = require("./reponse/sendJson");
const sendFile = require("./reponse/sendFile");
const parseConnectionDate = require("./functions/parseConnectionDate");
const calculateDisconnectionsByMonth = require("./functions/calculateDisconnectionsByMonth");

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
    row['Last date of connection'] = parseConnectionDate(row['Last date of connection']);
  });

  return data;
}

function getDataType(column, value) {
    if (value instanceof Date) {
        return "date";
    }


    if (column === "Last time of connection") {
        return "time";
    }


    if (typeof value === "number") {
        return "number";
    }


    return "string";
}

function getColumnDataTypes(data) {
  const columns = Object.keys(data[0] || {});
  const dataTypes = {};

  columns.forEach((column) => {
    const types = new Set(data.map((row) => getDataType(column, row[column])));

    if (types.size === 1) {
      dataTypes[column] = [...types][0];
    } else {
      dataTypes[column] = "mixed";
    }
  });

  return dataTypes;
}

function cleanCustomerData(data) {
  const withoutLowSpendings = deleteSpendingless(data);
  return removeDuplicates(withoutLowSpendings);
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

    if (pathname === "/api/summary") {
      const data = loadNumericData();
      const columns = Object.keys(data[0] || {});

      sendJson(res, {
        rowCount: data.length,
        columns,
        dataTypes: getColumnDataTypes(data),
      });
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

    if (pathname === "/api/customers/first-five") {
      const data = loadNumericData();

      sendJson(res, data.slice(0, 5));
            return;
    }

    if (pathname === "/api/ages/distribution") {
      const data = loadNumericData();
      sendJson(res, calculateAgeDistribution(data));
      return;
    }

    if (pathname === "/download/cleaned-dataset") {
      const data = loadNumericData();
      const cleanedData = cleanCustomerData(data);
      exportFichierClean(cleanedData, CLEANED_PATH);
      sendFile(
        res,
        CLEANED_PATH,
        "text/csv; charset=utf-8",
        "cleaned_dataset.csv"
      );
      return;
    }

    if (pathname === "/api/disconnections/by-month") {
      const data = loadNumericData();
      sendJson(res, calculateDisconnectionsByMonth(data));
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
