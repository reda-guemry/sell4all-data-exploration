const canvas = document.getElementById("spendingsChart");

fetch("http://localhost:10000/api/countries/spendings")
  .then((rsp) => rsp.json())
  .then((data) => {
    const countries = Object.keys(data);
    const ages = Object.values(data);

    new Chart(canvas, {
      type: "bar",
      data: {
        labels: countries,
        datasets: [
          {
            label: "Customer Spendings by Country",
            data: ages,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },

      options: {
        indexAxis: 'y' , 
        responsive: true,        
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Customer Spendings by Country",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  })
  .catch((err) => console.error(err));
