import {
  getAgeData,
  getCustomerCountByCountry,
  getCustomerSpendingsByCountry,
  getDashboardStats,
  getFirstFiveCustomers,
  getSummary,
} from "./api.js";

console.log(await getSummary());

import {
  createAgeDistributionChart,
  createHorizontalBarChart,
} from "./charts.js";

const numberFormatter = new Intl.NumberFormat("en-US");
const euroFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
});

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

function renderFirstFiveCustomers(customers) {
  const tableBody = document.getElementById("first-five-body");
  if (!tableBody) {
    return;
  }

  tableBody.innerHTML = customers
    .map(
      (customer) => `
        <tr class="border-b border-slate-100 last:border-0">
          <td class="px-4 py-3 font-medium text-slate-800">${customer.name}</td>
          <td class="px-4 py-3 text-slate-600">${customer.country}</td>
          <td class="px-4 py-3 text-slate-600">${customer.age}</td>
          <td class="px-4 py-3 text-slate-600">${customer.gender}</td>
          <td class="px-4 py-3 text-right font-semibold text-slate-800">${euroFormatter.format(customer.spendings)}</td>
        </tr>
      `,
    )
    .join("");
}



async function initDashboard() {

  const results = await Promise.allSettled([
    getDashboardStats(),
    getCustomerSpendingsByCountry(),
    getCustomerCountByCountry(),
    getAgeData(),
    getFirstFiveCustomers(),
  ]);

  const kpis = unwrap(results[0]);
  const spendings = unwrap(results[1]);
  const customersByCountry = unwrap(results[2]);
  const ageDistribution = unwrap(results[3]);
  const firstFive = unwrap(results[4]);



  if (kpis) {
    updateKpis(kpis);
  }

  if (firstFive) {
    renderFirstFiveCustomers(firstFive);
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

  if (customersByCountry) {
    const usageEntries = sortDescending(customersByCountry);

    createHorizontalBarChart("countriesUsageChart", 
      usageEntries.map(([country]) => country),
      usageEntries.map(([, value]) => value),
      {
      label: "Number of customers",
      tickFormatter: (value) => `${Math.round(value)}`,
      tooltipFormatter: (value) =>
        `${Number(value).toLocaleString("en-US")} customers`,
    });
  }

  if (ageDistribution) {
    createAgeDistributionChart(
      Object.keys(ageDistribution),
      Object.values(ageDistribution),
    );
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

initDashboard();
