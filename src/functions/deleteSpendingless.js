function removeSpendingless(data ) {
    return data.filter((row) => row["Customer spendings"] >= 10) ;
}


module.exports = removeSpendingless ;






