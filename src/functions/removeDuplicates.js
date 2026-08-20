function removeDupliates(data) {
    const uniqueData = [] ; 
    const seen = new Set() ; 

    data.forEach((row) => {
        const key  = JSON.stringify(row) ; 

        if(!seen.has(key)) {
            seen.add(key) ; 
            uniqueData.push(row) ; 
        }

    })

    return uniqueData ; 

}


module.exports = removeDupliates ;

