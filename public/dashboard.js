const API_ORIGIN = "http://localhost:10000";

const numberFormatter = new Intl.NumberFormat("en-US");
const euroFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
});

Chart.defaults.font.family = "Manrope, system-ui, sans-serif";
Chart.defaults.color = "#5d6d7e";

function sortEntriesDescending(data) {
  return Object.entries(data).sort((a, b) => b[1] - a[1]);
}

function setText(selector, value) {
  const node = document.querySelector(selector);
  if (node) {
    node.textContent = value;
  }
}

async function fetchJson(pathname) {
  const response = await fetch(`${API_ORIGIN}${pathname}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${pathname}`);
  }
  return response.json();
}

function renderOverview(overview) {
  setText(
    '[data-overview="originalRows"]',
    numberFormatter.format(overview.originalRows),
  );
  setText(
    '[data-overview="rowsAfterSpendingFilter"]',
    numberFormatter.format(overview.rowsAfterSpendingFilter),
  );
  setText(
    '[data-overview="rowsAfterDuplicates"]',
    numberFormatter.format(overview.rowsAfterDuplicates),
  );
  setText(
    '[data-overview="finalCleanedRows"]',
    numberFormatter.format(overview.finalCleanedRows),
  );
  setText(
    '[data-overview="exportedColumns"]',
    numberFormatter.format(overview.exportedColumns),
  );

  const removedLowSpend =
    overview.originalRows - overview.rowsAfterSpendingFilter;
  const removedDuplicates =
    overview.rowsAfterSpendingFilter - overview.rowsAfterDuplicates;

  setText(
    '[data-overview-hint="spending"]',
    `${numberFormatter.format(removedLowSpend)} low-value record${
      removedLowSpend === 1 ? "" : "s"
    } excluded`,
  );
  setText(
    '[data-overview-hint="duplicates"]',
    `${numberFormatter.format(removedDuplicates)} duplicate record${
      removedDuplicates === 1 ? "" : "s"
    } removed`,
  );
}

function createHorizontalBarChart(
  canvas,
  labels,
  values,
  { label, tickFormatter, tooltipFormatter, compact = false },
) {
  const frame = canvas.parentElement;

  frame.style.height = compact ? "500px" : "700px";

  return new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label,
          data: values,
          backgroundColor: "rgba(15, 118, 110, 0.72)",
          hoverBackgroundColor: "#0f766e",
          borderRadius: 6,
          borderSkipped: false,
          barThickness: 16,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        tooltip: {
          backgroundColor: "#122033",
          padding: 12,
          cornerRadius: 8,
          titleFont: {
            weight: "700",
          },

          callbacks: {
            label: (context) => ` ${tooltipFormatter(context.parsed.x)}`,
          },
        },
      },

      scales: {
        x: {
          beginAtZero: true,

          grid: {
            color: "#eef2f4",
          },

          ticks: {
            callback: tickFormatter,
          },

          title: {
            display: true,
            text: label,
            color: "#122033",
            font: {
              weight: "700",
            },
          },
        },

        y: {
          grid: {
            display: false,
          },

          ticks: {
            autoSkip: false,
            font: {
              size: 11,
            },
          },

          title: {
            display: true,
            text: "Country",
            color: "#122033",
            font: {
              weight: "700",
            },
          },
        },
      },
    },
  });
}

async function initDashboard() {

  try {
    const [kpis, spendings, medianAge, overview] = await Promise.all([
      fetchJson("/api/kpis"),
      fetchJson("/api/countries/spendings"),
      fetchJson("/api/countries/median-age"),
      fetchJson("/api/dataset/overview"),
    ]);

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

    renderOverview(overview);

    const spendingEntries = sortEntriesDescending(spendings);
    const ageEntries = sortEntriesDescending(medianAge);

    setText(
      "#spendings-caption",
      `Total customer spendings across ${numberFormatter.format(
        spendingEntries.length,
      )} countries`,
    );

    createHorizontalBarChart(
      document.getElementById("spendingsChart"),
      spendingEntries.map(([country]) => country),
      spendingEntries.map(([, value]) => value),
      {
        label: "Customer spendings (€)",
        tickFormatter: (value) =>
          `${Math.round(value).toLocaleString("en-US")} €`,
        tooltipFormatter: (value) => euroFormatter.format(value),
      },
    );

    createHorizontalBarChart(
      document.getElementById("medianAgeChart"),
      ageEntries.map(([country]) => country),
      ageEntries.map(([, value]) => value),
      {
        label: "Median age (years)",
        tickFormatter: (value) => `${value}`,
        tooltipFormatter: (value) => `${value} years`,
        compact: true,
      },
    );
  } catch (error) {
    console.error(error);
    const banner = document.getElementById("error-banner");
    banner.hidden = false;
  }
}

initDashboard();
