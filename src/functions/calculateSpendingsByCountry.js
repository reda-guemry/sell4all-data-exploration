
function calculateSpendingsByCountry(data) {
    const  countrySpendings = {} ; 

    data.forEach((row) => {
        const country = row.Country ; 

        if (!countrySpendings[country]) {
            countrySpendings[country] = 0 ; 
        } 
        countrySpendings[country] += row['Customer spendings'] ; 
    })

    return countrySpendings ;

}

module.exports = calculateSpendingsByCountry ; 