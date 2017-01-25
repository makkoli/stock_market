var Stock = require('../models/stock-model');

// Gets all the stocks currently stored in the database
exports.getStocks = function(cb) {
    Stock.find({}).sort({ lastUpdated: -1 }).exec(function(err, docs) {
        if (err) console.log(err);

        var stocks = [];

        docs.forEach(function(stock) {
            stocks.push({
                identifier: stock.identifier,
                data: stock.data
            });
        });
        cb(stocks);
    });
};

// Remove a stock from the database
exports.removeStock = function(symbol, cb) {
    var query = { identifier: symbol };

    Stock.findOne(query, function(err, doc) {
        if (err) console.log(err);

        doc.remove();
        cb(symbol);
    })
};
