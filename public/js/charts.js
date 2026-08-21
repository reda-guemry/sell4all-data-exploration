const Chart = window.Chart;

Chart.defaults.font.family = "Manrope, system-ui, sans-serif";
Chart.defaults.color = "#64748b";

const chartInstances = {};

function destroyChart(canvasId) {
  if (chartInstances[canvasId]) {
    chartInstances[canvasId].destroy();
    chartInstances[canvasId] = null;
  }
}

export function createHorizontalBarChart(canvasId, labels, values, options) {
  destroyChart(canvasId);

  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    return;
  }

  chartInstances[canvasId] = new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: options.label,
          data: values,
          backgroundColor: "rgba(15, 118, 110, 0.75)",
          hoverBackgroundColor: "#0f766e",
          borderRadius: 4,
          borderSkipped: false,
          maxBarThickness: 14,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#122033",
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: (context) => ` ${options.tooltipFormatter(context.parsed.x)}`,
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: "#eef2f4" },
          ticks: { callback: options.tickFormatter },
          title: {
            display: true,
            text: options.label,
            color: "#122033",
            font: { size: 12, weight: "600" },
          },
        },
        y: {
          grid: { display: false },
          ticks: { autoSkip: false, font: { size: 11 } },
        },
      },
    },
  });
}

export function createAgeDistributionChart(labels, values) {
  destroyChart("ageDistributionChart");

  const canvas = document.getElementById("ageDistributionChart");
  if (!canvas) {
    return;
  }

  chartInstances.ageDistributionChart = new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Customers",
          data: values,
          backgroundColor: "rgba(15, 118, 110, 0.75)",
          hoverBackgroundColor: "#0f766e",
          borderRadius: 6,
          borderSkipped: false,
          maxBarThickness: 48,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#122033",
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: (context) =>
              ` ${Number(context.parsed.y).toLocaleString("en-US")} customers`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          title: {
            display: true,
            text: "Age group",
            color: "#122033",
            font: { size: 12, weight: "600" },
          },
        },
        y: {
          beginAtZero: true,
          grid: { color: "#eef2f4" },
          title: {
            display: true,
            text: "Customers",
            color: "#122033",
            font: { size: 12, weight: "600" },
          },
        },
      },
    },
  });
}

export function createDisconnectionsLineChart(canvas, labels, values) {
  if (!canvas) {
    return;
  }

  destroyChart(canvas.id);

  chartInstances[canvas.id] = new Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Customers",
          data: values,
          borderColor: "#0f766e",
          backgroundColor: "rgba(15, 118, 110, 0.12)",
          pointBackgroundColor: "#0f766e",
          pointBorderColor: "#0f766e",
          pointRadius: 4,
          pointHoverRadius: 5,
          tension: 0.2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#122033",
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: (context) =>
              ` ${Number(context.parsed.y).toLocaleString("en-US")} customers`,
          },
        },
      },
      scales: {
        x: {
          grid: { color: "#eef2f4" },
          title: {
            display: true,
            text: "Month",
            color: "#122033",
            font: { size: 12, weight: "600" },
          },
        },
        y: {
          beginAtZero: true,
          grid: { color: "#eef2f4" },
          title: {
            display: true,
            text: "Number of customers",
            color: "#122033",
            font: { size: 12, weight: "600" },
          },
        },
      },
    },
  });
}
