var env = require('../env/env'),
    https = require('https'),
    Stock = require('../models/stock-model');

// Get the stock data for a company
exports.getStockData = function(symbol, invalidRenderCb, renderCb) {
    getStockFromDB(symbol, invalidRenderCb, renderCb);
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
                renderCb(company);
                // Add the stock to the database
                addStock(company.identifier, company.data);
            }
        });
    });

    request.end();
};

// Gets a stock from the database
function getStockFromDB(symbol, invalidRenderCb, renderCb) {
    var query = { symbol: symbol };

    Stock.findOne(query, function(err, stock) {
        if (err) return err;

        // If no matching document retrieve the stock from the api
        if (!stock) {
            getStockFromAPI(symbol, invalidRenderCb, renderCb);
        }
        // Else, return the stock
        else {
            renderCb(stock);
        }
    });
};

// Add a stock to the database
addStock = function(symbol, data) {
    var newStock = new Stock({
        symbol: symbol,
        data: data,
        lastUpdate: new Date()
    });

    newStock.save(function(err) {
        if (err) console.log(err);
    });
};
