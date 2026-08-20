

const ctx = document.getElementById('spendingsChart')

new Chart (ctx, {
    type: 'bar' , 
    data: {
        labels: ['Morocco' , 'France' , 'Germany' , 'Spain' , 'Italy' , 'Portugal'] ,
        datasets: [{
            label: 'Customer spendings by country' ,
            data: [1200 , 1500 , 800 , 1000 , 900 , 700] ,
        }]
    }
})