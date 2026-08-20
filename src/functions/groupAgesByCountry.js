function groupAgesByCountry(data) {
  const countryAge = {};

  data.forEach((row) => {
    const country = row.Country;

    if (!countryAge[country]) {
      countryAge[country] = [];
    }

    countryAge[country].push(row.Age);
  });

  return countryAge;

}

module.exports = groupAgesByCountry ; 