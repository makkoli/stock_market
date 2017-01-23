// Generate chart based off of data retrieved from server
var stockChart = (function() {
    var config = {
        type: 'line',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'month'
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 20
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "Closing Price"
                    },
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            tooltips: {
                displayColors: false
            }
        }
    };

    loadChart = function() {
        var canvas = document.getElementById('chartContainer').getContext('2d');
        window.stockLine = new Chart(canvas, config);
    };

    addStock = function(stock) {
        console.log(stock);
        // Initialize labels
        if (config.data.labels.length === 0) {
            config.data.labels = stock.data.labels;
        }
        var stockColor = generateColor();
        console.log(stockColor);

        // Add stock
        var newStock = {
            label: stock.identifier,
            borderColor: stockColor,
            borderWidth: 2,
            fill: false,
            backgroundColor: stockColor,
            pointBackgroundColor: stockColor,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHitRadius: 5,
            pointHoverBorderColor: "rgba(0,0,0,1)",
            pointHoverBorderWidth: 1,
            lineTension: 0,
            data: stock.data.value
        };

        config.data.datasets.push(newStock);
        window.stockLine.update();
    };

    removeStock = function(stockId) {
        // Remove labels if last stock being removed
        if (config.data.labels.length - 1 === 0) {
            config.data.labels = [];
        }

        // Remove stock
        config.data.datasets = config.data.datasets.filter(function(stock) {
            return stockId !== stock.label;
        });
        window.stockLine.update();
    };

    // Generate a random rgba color for the line
    function generateColor() {
        return "rgba(0," +
            Math.round(Math.random() * 255) + "," +
            Math.round(Math.random()) * 255 + ",1)";
    };

    return {
        loadChart: loadChart,
        addStock: addStock,
        removeStock: removeStock
    };
})();

stockChart.loadChart();
