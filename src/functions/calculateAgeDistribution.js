function calculateAgeDistribution(data) {
  const distribution = {
    "Under 25": 0,
    "25-34": 0,
    "35-44": 0,
    "45-54": 0,
    "55-64": 0,
    "65+": 0,
  };

  data.forEach((row) => {
    const age = row.Age;
    if (!Number.isFinite(age)) {
      return;
    }

    if (age < 25) {
      distribution["Under 25"] += 1;
    } else if (age < 35) {
      distribution["25-34"] += 1;
    } else if (age < 45) {
      distribution["35-44"] += 1;
    } else if (age < 55) {
      distribution["45-54"] += 1;
    } else if (age < 65) {
      distribution["55-64"] += 1;
    } else {
      distribution["65+"] += 1;
    }
  });

  return distribution;
}

module.exports = calculateAgeDistribution;
