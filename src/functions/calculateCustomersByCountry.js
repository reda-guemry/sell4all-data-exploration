function calculateCustomersByCountry(data) {
  const customersByCountry = {};

  data.forEach((row) => {
    const country = row.Country;

    if (!customersByCountry[country]) {
      customersByCountry[country] = 0;
    }

    customersByCountry[country] += 1;
  });

  return customersByCountry;
}

module.exports = calculateCustomersByCountry;
