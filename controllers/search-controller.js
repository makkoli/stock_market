var env = require('../env/env'),
    https = require('https'),
    Stock = require('../models/stock-model');

// Get the stock data for a company
// @symbol: stock symbol to search for
// @invalidRenderCb: render callback if invalid stock symbol
// @renderCb: render callback once stock symbol is retrieved
exports.addStockData = function(symbol, invalidRenderCb, renderCb) {
    getStockFromAPI(symbol, invalidRenderCb, renderCb);
};

// Gets a stock from the initriox api
function getStockFromAPI(symbol, invalidRenderCb, renderCb) {
    var year = (new Date().getFullYear() - 1).toString();
    var month = (new Date().getMonth() + 1).toString();
    var date = (new Date().getDate()).toString();

    var startDate = year + '-' + month + '-' + date;

    var auth = "Basic " + new Buffer(env.env.intrinioUser + ':'
        + env.env.intrinioPass).toString('base64');

    var request = https.request({
        method: "GET",
        host: "api.intrinio.com",
        path: "/historical_data?identifier=" + symbol +
            "&item=close_price&start_date=" + startDate,
        headers: {
            "Authorization": auth
        }
    }, function(response) {
        var json = "";
        response.on('data', function (chunk) {
            json += chunk;
        });
        response.on('end', function() {
            var company = JSON.parse(json);
            // No symbol found
            if (company.data === null) {
                invalidRenderCb();
            }
            // Return stock data to render
            else {
                var companyData = {
                    identifier: company.identifier,
                    data: {
                        labels: company.data.map(function(closePrice) {
                            return closePrice.date;
                        }),
                        value: company.data.map(function(closePrice) {
                            return closePrice.value;
                        })
                    }
                };
                renderCb(companyData);
                // Add the stock to the database
                addStock(companyData);
            }
        });
    });

    request.end();
};

// Add a stock to the database
addStock = function(company) {
    var newStock = new Stock({
        identifier: company.identifier,
        data: company.data,
        lastUpdate: new Date()
    });

    newStock.save(function(err) {
        if (err) console.log(err);
    });
};
