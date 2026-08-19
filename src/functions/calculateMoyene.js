function calculateMoyenne(numbers) {
    const sum = numbers.reduce((acc, curr) => acc + curr, 0) ; 
    return Number((sum / numbers.length).toFixed(2)) ; 
}
module.exports = calculateMoyenne ; 
