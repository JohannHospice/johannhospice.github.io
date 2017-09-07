
var ctx = document.getElementById("chart-language").getContext('2d');

var myChart = new Chart(ctx, {
    type: 'radar',
    data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 16, 10, 15],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
            ],
            borderWidth: 1
        }]
    }
});