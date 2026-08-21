# Sell4All — Customer Data Exploration

## 1. Project Overview

Sell4All is an online retailer specialised in second-hand clothing. This project performs a first exploration and qualification of its customer CSV using Node.js and JavaScript.

The work reads `data/dataset-sell4all.csv`, produces a technical summary, computes the statistics required by the assignment, visualises total customer spendings by country, cleans the dataset, and exports a reduced CSV for later use in a web analytics product.

## 2. Business Need

After six months of activity, Sell4All wants to prepare a customer analytics dashboard. Before that product can be built, the company needs to:

- understand what customer data is available
- inspect data quality and column types
- calculate basic age and spending statistics
- observe country-level behaviour
- remove low-value and duplicate records
- prepare a clean file that can later be integrated into a web application

## 3. Project Objective

The assignment objectives implemented in this project are:

- read `dataset-sell4all.csv`
- display the first 5 rows of the source file
- produce a technical summary (row count, columns, data types)
- explain that technical summary
- calculate average and median **Age**
- calculate average and median **Customer spendings**
- calculate median Age for each country
- visualise **total** Customer spendings by country
- remove rows where Customer spendings are below 10€
- remove duplicate rows
- export a new CSV containing only `Country`, `Age`, `Gender`, and `Customer spendings`

## 4. Technologies

Technologies actually used in this repository:

- Node.js
- Native Node.js HTTP server (`http`)
- `fs` and `path`
- `csv-parse` for CSV reading
- Chart.js installed with npm 
- Chart.js loaded in the browser from the local file `public/js/vendor/chart.umd.js`
- Tailwind CSS via CDN
- Lucide via CDN
- Vanilla JavaScript 


## 5. Project Structure

```text
sell4all-data-exploration/
├── data/
│   └── dataset-sell4all.csv
├── src/
│   ├── index.js
│   ├── functions/
│   │   ├── calculateMedian.js
│   │   ├── calculateMoyene.js
│   │   ├── calculateSpendingsByCountry.js
│   │   ├── groupAgesByCountry.js
│   │   ├── calculateAgeDistribution.js
│   │   ├── calculateDisconnectionsByMonth.js
│   │   ├── parseConnectionDate.js
│   │   ├── deleteSpendingless.js
│   │   ├── removeDuplicates.js
│   │   └── exportFichierclean.js
│   └── reponse/
│       ├── sendJson.js
│       └── sendFile.js
├── public/
│   ├── index.html
│   └── js/
│       ├── api.js
│       ├── charts.js
│       ├── dashboard.js
│       └── vendor/
│           └── chart.umd.js
├── output/
│   └── cleaned_dataset.csv
├── package.json
├── package-lock.json
└── README.md
```

Analysis runs in Node.js. The browser fetches JSON and renders the dashboard.

## 6. Three-Day Work Plan

**Day 1 — Setup and first reading**

- create the Node.js project and install dependencies
- read and parse `dataset-sell4all.csv`
- inspect the first rows, columns, and value types
- convert `Age` and `Customer spendings` to numbers without converting phone numbers or postal codes

**Day 2 — Analysis and visualization**

- implement reusable mean and median functions
- group ages by country and compute median age per country
- compute total spendings by country
- expose results through a native HTTP API
- build the Chart.js dashboard, with spendings by country as the required chart

**Day 3 — Cleaning, export, and presentation**

- remove spendings below 10€, then remove duplicates
- export the four required columns
- connect **Download Clean Data** to that cleaning pipeline
- refine the dashboard and write this README

## 7. Features Implemented

### Required

- CSV reading in Node.js
- first 5 rows of the **source** dataset
- technical summary (rows, columns, types)
- average and median Age
- average and median Customer spendings
- median Age by country
- bar chart of **total** customer spendings by country
- filter Customer spendings < 10€
- duplicate removal
- cleaned CSV export with four columns

### Additional

- KPI cards
- dashboard chart for median Age by country
- Customer Age Distribution chart
- Customer Disconnections by Month line chart
- **Download Clean Data** button that regenerates the cleaned file
- native HTTP API
- responsive Tailwind dashboard

## 8. Technical Summary

The technical summary is produced by `GET /api/summary` from the source CSV after the conversions applied in `loadNumericData()`.

| Item | Value |
| --- | ---: |
| Source rows | 505 |
| Columns | 11 |
| Unique countries | 35 |

Column list:

`Name`, `Phone Number`, `Email`, `Address`, `Country`, `Postal code`, `Last date of connection`, `Last time of connection`, `Age`, `Gender`, `Customer spendings`

Interpreted types :

| Column | Type |
| --- | --- |
| Name | string |
| Phone Number | string |
| Email | string |
| Address | string |
| Country | string |
| Postal code | string |
| Last date of connection | date |
| Last time of connection | time |
| Age | number |
| Gender | string |
| Customer spendings | number |

**Why these types**

- `csv-parse` first reads every cell as text.
- `Age` is converted with `Number()` because mean and median require numeric values.
- `Customer spendings` is converted with `Number()` for statistics, the `< 10€` filter, and country totals.
- `Phone Number` and `Postal code` stay strings. They look numeric but are identifiers, not quantities to add or average.
- Name, Email, Address, Country, and Gender stay strings.
- `Last date of connection` is parsed with `parseConnectionDate()` into a JavaScript `Date`, because the CSV mixes formats such as `5-Apr-21` and `oct. 10, 2021`.
- `Last time of connection` is labelled `time`. The value remains a time-formatted string (for example `4:39`), because JavaScript has no standalone `Time` primitive.

The dashboard First 5 Customers table shows these types next to each column name.

## 9. Analysis Results

All values below were recalculated from `data/dataset-sell4all.csv` with the project functions.

### Dataset Overview

| Metric | Result |
| --- | ---: |
| Source rows | 505 |
| Columns | 11 |
| Unique countries | 35 |

### Global Statistics

| Metric | Result |
| --- | ---: |
| Average Age | 46.08 |
| Median Age | 46 |
| Average Customer spendings | 311.17 € |
| Median Customer spendings | 307 € |

### Median Age by Country

Calculated with `groupAgesByCountry()` and `calculateMedian()`, exposed by `GET /api/countries/median-age`. All 35 countries:

| Country | Median Age |
| --- | ---: |
| Australia | 44 |
| Austria | 43 |
| Belgium | 39 |
| Brazil | 49.5 |
| Canada | 46 |
| Chile | 46 |
| China | 35 |
| Colombia | 29 |
| Costa Rica | 48 |
| France | 56.5 |
| Germany | 53 |
| India | 45.5 |
| Indonesia | 41.5 |
| Ireland | 49 |
| Italy | 41 |
| Mexico | 47 |
| Netherlands | 48 |
| New Zealand | 38 |
| Nigeria | 37 |
| Norway | 54 |
| Pakistan | 44 |
| Peru | 38 |
| Philippines | 51 |
| Poland | 49.5 |
| Russian Federation | 48 |
| Singapore | 41.5 |
| South Africa | 43 |
| South Korea | 49.5 |
| Spain | 54.5 |
| Sweden | 40 |
| Turkey | 60 |
| Ukraine | 46 |
| United Kingdom | 48.5 |
| United States | 48.5 |
| Vietnam | 48 |

### Customer Spendings by Country

**Total** spendings, from `calculateSpendingsByCountry()` / `GET /api/countries/spendings`. All 35 countries:

| Country | Total Customer Spendings (€) |
| --- | ---: |
| Australia | 3492 |
| Austria | 4584 |
| Belgium | 2806 |
| Brazil | 4113 |
| Canada | 3026 |
| Chile | 4351 |
| China | 5959 |
| Colombia | 3881 |
| Costa Rica | 3743 |
| France | 4598 |
| Germany | 4989 |
| India | 4543 |
| Indonesia | 5236 |
| Ireland | 5284 |
| Italy | 2742 |
| Mexico | 8436 |
| Netherlands | 7243 |
| New Zealand | 6396 |
| Nigeria | 4247 |
| Norway | 3387 |
| Pakistan | 3913 |
| Peru | 5108 |
| Philippines | 5001 |
| Poland | 3566 |
| Russian Federation | 4516 |
| Singapore | 2069 |
| South Africa | 5369 |
| South Korea | 4216 |
| Spain | 4165 |
| Sweden | 3420 |
| Turkey | 4091 |
| Ukraine | 5488 |
| United Kingdom | 1561 |
| United States | 7166 |
| Vietnam | 4435 |

### First 5 Source Rows

First 5 rows of the source dataset (`data/dataset-sell4all.csv`), before cleaning:

| Name | Phone Number | Country | Age | Gender | Customer spendings | Last date of connection |
| --- | --- | --- | ---: | --- | ---: | --- |
| Aaron Cote | 966-7625 | Norway | 71 | Man | 356 | 5-Apr-21 |
| Angelica Lawson | 232-3051 | Pakistan | 37 | Women | 173 | oct. 10, 2021 |
| Louis Gilbert | 1-997-733-0134 | Colombia | 24 | Women | 105 | 2-Jul-22 |
| Basia Finley | 1-987-322-7148 | South Africa | 37 | Women | 28 | 19-Feb-22 |
| Rhona Sears | 387-7682 | France | 42 | Women | 13 | 31-Mar-22 |

The dashboard table displays all 11 source columns for these same five customers.

### Cleaning Results

| Metric | Result |
| --- | ---: |
| Original rows | 505 |
| Rows removed because spending under 10€ | 3 |
| Rows after spending filter | 502 |
| Duplicate rows removed | 5 |
| Final cleaned rows | 497 |
| Exported columns | 4 |

## 10. Data Cleaning

Cleaning sequence used by the download pipeline:

1. Remove rows where `Customer spendings < 10` (`deleteSpendingless()` keeps values `>= 10`)
2. Remove duplicate rows (`removeDuplicates()`)
3. Keep only `Country`, `Age`, `Gender`, `Customer spendings`
4. Write `output/cleaned_dataset.csv`

Low spendings are excluded because they are not useful for commercial analysis. Duplicates are removed so the same customer record is not counted twice. The exported file keeps only the fields required for later product work.

## 11. Visualization

### Required visualization — Customer Spendings by Country

- Chart.js bar chart
- 35 countries
- **total** customer spendings, not averages
- data from `GET /api/countries/spendings`
- responsive dashboard card

### Additional visualizations

- Median Age by Country 
- Customer Age Distribution 
- Customer Disconnections by Month 

## 12. Difficulties and Solutions

**CSV values arrive as strings**  
`csv-parse` reads cells as text. Using `+` on ages concatenates them (`"41" + "34"` → `"4134"`) instead of adding them.  
**Solution:** convert `Age` and `Customer spendings` with `Number()` before any calculation.

**Mixed date formats**  
`Last date of connection` uses both `5-Apr-21` and `oct. 10, 2021`.  
**Solution:** `parseConnectionDate()` normalises both formats into a JavaScript `Date`.

**Chart.js in a vanilla HTML page**  
The assignment requires installing Chart.js with npm, but the dashboard is not bundled with Vite or Webpack.  
**Solution:** Chart.js is installed with npm, and the browser loads the local UMD build from `public/js/vendor/chart.umd.js`.

## 13. API Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/kpis` | Row count, average/median Age, average/median spendings, country count |
| GET | `/api/summary` | Row count, column names, interpreted data types |
| GET | `/api/countries/spendings` | Total customer spendings by country |
| GET | `/api/countries/median-age` | Median Age by country |
| GET | `/api/customers/first-five` | First 5 rows of the source dataset |
| GET | `/api/ages/distribution` | Customers grouped by age range |
| GET | `/api/disconnections/by-month` | Customers grouped by last connection month |
| GET | `/download/cleaned-dataset` | Run cleaning, save, and download the cleaned CSV |

## 14. Installation and Execution

```bash
npm install
npm start
```

Development with auto-reload:

```bash
npm run dev
```

Then open:

```text
http://localhost:10000
```

The server listens on port `10000` (`src/index.js`).

## 15. Clean CSV Download

The **Download Clean Data** button calls `GET /download/cleaned-dataset`.

Workflow on every click:

1. read `data/dataset-sell4all.csv`
2. `deleteSpendingless()` — remove spendings below 10€
3. `removeDuplicates()` — remove duplicate rows
4. `exportFichierClean()` — keep four columns
5. overwrite `output/cleaned_dataset.csv`
6. send the file with `Content-Disposition: attachment; filename="cleaned_dataset.csv"`

The file is regenerated on each download. It is not a static copy of an old export.
