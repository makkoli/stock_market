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

    // Add the list of stocks to the chart
    addStocks = function(stocks) {
        // add stocks starting at the end of the list with the newest
        // list will always have the newest stock at the end
        var currentStockLength = config.data.datasets.length;
        for (var i = stocks.length - 1; (i + 1) > currentStockLength; i--) {
            addStock(stocks[i]);
        }
    }

    // Add an individual stock to the chart
    addStock = function(stock) {
        // Initialize labels
        if (config.data.labels.length === 0) {
            config.data.labels = stock.data.labels;
        }
        var stockColor = generateColor();

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

    // Remove an individual stock from the chart
    /*removeStock = function(stocks) {
        // Remove labels if last stock being removed
        if (config.data.datasets.length - 1 === 0) {
            config.data.labels = [];
            config.data.datasets = [];
        }
        // else, remove the stock by replacing the dataset
        else {
            config.data.datasets = config.data.datasets.filter(function(stock) {
                for (var i = 0; i < stocks.length; i++) {
                    if (stocks[i].identifier === stock.label) {
                        return true;
                    }
                }
                return false;
            });
        }
        window.stockLine.update();
    };*/
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

    // Public method to update the chart with a list of stocks
    // @stocks: a list of stocks currently viewable
    updateChart = function(stocks) {
        // if list is longer add new stock(s)
        if (stocks.length > config.data.datasets) {
            addStocks(stocks);
        }
        // else, remove the stock
        else {
            removeStock(stocks);
        }
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
        removeStock: removeStock,
        updateChart: updateChart
    };
})();

stockChart.loadChart();
