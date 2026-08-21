function parseConnectionDate(value) {
    if (!value || typeof value !== "string") {
        return null;
    }

    const normalized = value.trim().replace(/\./g, "");

    const match = normalized.match(
        /^(\d{1,2})[-\s]([A-Za-z]{3})[-\s](\d{2}|\d{4})$/
    );

    if (match) {
        const [, day, monthName, yearValue] = match;

        const months = {
            Jan: 0,
            Feb: 1,
            Mar: 2,
            Apr: 3,
            May: 4,
            Jun: 5,
            Jul: 6,
            Aug: 7,
            Sep: 8,
            Oct: 9,
            Nov: 10,
            Dec: 11
        };

        const month = months[
            monthName.charAt(0).toUpperCase() +
            monthName.slice(1).toLowerCase()
        ];

        if (month === undefined) {
            return null;
        }

        let year = Number(yearValue);

        if (yearValue.length === 2) {
            year += 2000;
        }

        return new Date(year, month, Number(day));
    }

    const matchEnglish = normalized.match(
        /^([A-Za-z]{3})\s+(\d{1,2}),\s*(\d{4})$/
    );

    if (matchEnglish) {
        const [, monthName, day, year] = matchEnglish;

        const months = {
            Jan: 0,
            Feb: 1,
            Mar: 2,
            Apr: 3,
            May: 4,
            Jun: 5,
            Jul: 6,
            Aug: 7,
            Sep: 8,
            Oct: 9,
            Nov: 10,
            Dec: 11
        };

        const month = months[
            monthName.charAt(0).toUpperCase() +
            monthName.slice(1).toLowerCase()
        ];

        if (month === undefined) {
            return null;
        }

        return new Date(Number(year), month, Number(day));
    }

    return null;
}

module.exports = parseConnectionDate;