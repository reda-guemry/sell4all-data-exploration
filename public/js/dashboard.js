import {
  getAgeData,
  getCustomerSpendingsByCountry,
  getDashboardStats,
  getDisconnectionsByMonth,
  getFirstFiveCustomers,
  getMedianAgeByCountry,
  getSummary,
} from "./api.js";

import {
  createAgeDistributionChart,
  createDisconnectionsLineChart,
  createHorizontalBarChart,
} from "./charts.js";

const numberFormatter = new Intl.NumberFormat("en-US");

function setText(selector, value) {
  const node = document.querySelector(selector);
  if (node) {
    node.textContent = value;
  }
}

function sortDescending(data) {
  return Object.entries(data).sort((a, b) => b[1] - a[1]);
}

function unwrap(result) {
  if (result.status === "fulfilled") {
    return result.value;
  }
  console.error(result.reason);
  return null;
}

function updateKpis(kpis) {
  setText(
    '[data-kpi="totalCustomers"]',
    numberFormatter.format(kpis.totalCustomers),
  );
  setText('[data-kpi="averageAge"]', numberFormatter.format(kpis.averageAge));
  setText('[data-kpi="medianAge"]', numberFormatter.format(kpis.medianAge));
  setText(
    '[data-kpi="averageSpendings"]',
    numberFormatter.format(kpis.averageSpendings),
  );
  setText(
    '[data-kpi="medianSpendings"]',
    numberFormatter.format(kpis.medianSpendings),
  );
  setText('[data-kpi="countries"]', numberFormatter.format(kpis.countries));
}

function formatFirstFiveValue(column, value) {
  if (column !== "Last date of connection" || value == null || value === "") {
    return value ?? "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function renderFirstFiveCustomers(customers, dataTypes) {
  const tableHead = document.getElementById("first-five-head");
  const tableBody = document.getElementById("first-five-body");
  if (!tableHead || !tableBody || customers.length === 0) {
    return; 
  }

  const columns = Object.keys(customers[0]);

  tableHead.innerHTML = columns
    .map((column) => {
      const type = dataTypes[column];
      const typeMarkup = type
        ? `<span class="ml-1 text-[10px] font-normal tracking-normal text-slate-400">(${type})</span>`
        : "";

      return `<th class="px-4 py-3 whitespace-nowrap">${column}${typeMarkup}</th>`;
    })
    .join("");

  tableBody.innerHTML = customers
    .map(
      (customer) => `
        <tr class="border-b border-slate-100 last:border-0">
          ${columns
            .map(
              (column, index) => `
                <td class="px-4 py-3 whitespace-nowrap ${
                  index === 0
                    ? "font-medium text-slate-800"
                    : "text-slate-600"
                }">${formatFirstFiveValue(column, customer[column])}</td>
              `,
            )
            .join("")}
        </tr>
      `,
    )
    .join("");
}



async function initDashboard() {

  const results = await Promise.allSettled([
    getDashboardStats(),
    getCustomerSpendingsByCountry(),
    getMedianAgeByCountry(),
    getAgeData(),
    getFirstFiveCustomers(),
    getDisconnectionsByMonth(),
    getSummary(),
  ]);

  const kpis = unwrap(results[0]);
  const spendings = unwrap(results[1]);
  const medianAgeByCountry = unwrap(results[2]);
  const ageDistribution = unwrap(results[3]);
  const firstFive = unwrap(results[4]);
  const disconnectionsByMonth = unwrap(results[5]);
  const summary = unwrap(results[6]);



  if (kpis) {
    updateKpis(kpis);
  }

  if (firstFive) {
    renderFirstFiveCustomers(firstFive, summary?.dataTypes || {});
  }

  if (spendings) {
    const spendingEntries = sortDescending(spendings);

    createHorizontalBarChart(
      "spendingsChart",
      spendingEntries.map(([country]) => country),
      spendingEntries.map(([, value]) => value),
      {
        label: "Customer spendings (€)",
        tickFormatter: (value) => `${Math.round(value).toLocaleString("en-US")} €`,
        tooltipFormatter: (value) =>
          new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
          }).format(value),
      },
    );
  }

  if (medianAgeByCountry) {
    const medianAgeEntries = sortDescending(medianAgeByCountry);

    createHorizontalBarChart(
      "medianAgeChart",
      medianAgeEntries.map(([country]) => country),
      medianAgeEntries.map(([, value]) => value),
      {
        label: "Median age (years)",
        tickFormatter: (value) => `${value}`,
        tooltipFormatter: (value) => `${value} years`,
      },
    );
  }

  if (ageDistribution) {
    createAgeDistributionChart(
      Object.keys(ageDistribution),
      Object.values(ageDistribution),
    );
  }

  if (disconnectionsByMonth) {
    createDisconnectionsLineChart(
      document.getElementById("disconnectionsChart"),
      Object.keys(disconnectionsByMonth),
      Object.values(disconnectionsByMonth),
    );
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

initDashboard();
