const API_ORIGIN = "http://localhost:10000";

async function fetchJson(pathname) {
  const response = await fetch(`${API_ORIGIN}${pathname}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${pathname}`);
  }


  const data = await response.json(); 

  // console.log(data);

  return data;
}

export function getSummary() {
  return fetchJson("/api/summary");
}

export function getDashboardStats() {
  return fetchJson("/api/kpis");
}

export function getCustomerSpendingsByCountry() {
  return fetchJson("/api/countries/spendings");
}

export function getMedianAgeByCountry() {
  return fetchJson("/api/countries/median-age");
}

export function getFirstFiveCustomers() {
  return fetchJson("/api/customers/first-five");
}

export function getAgeData() {
  return fetchJson("/api/ages/distribution");
}

export function getDisconnectionsByMonth() {
  return fetchJson("/api/disconnections/by-month");
}