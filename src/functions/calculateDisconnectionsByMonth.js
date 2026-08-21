
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];


function calculateDisconnectionsByMonth(data) {
  const counts = {};

  data.forEach((row) => {
    const date = row["Last date of connection"];
    if (!date) {
      return;
    }
    const label = `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
    const order = date.getFullYear() * 12 + date.getMonth();

    if (!counts[order]) {
      counts[order] = { label, count: 0 };
    }

    counts[order].count += 1;
  });

  const disconnectionsByMonth = {};

  Object.keys(counts)
    .map(Number)
    .sort((a, b) => a - b)
    .forEach((order) => {
      disconnectionsByMonth[counts[order].label] = counts[order].count;
    });

  return disconnectionsByMonth;
}

module.exports = calculateDisconnectionsByMonth;
