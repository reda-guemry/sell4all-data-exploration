function calculateMoyenne(numbersArray) {

    // help me to convert the type of the numbers to number
    const numbers = numbersArray.map(Number) ; 

    const sum = numbers.reduce((acc, curr) => acc + curr, 0) ; 
    return Number((sum / numbers.length).toFixed(2)) ; 
}
module.exports = calculateMoyenne ; 
