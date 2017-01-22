var Stock = require('../models/stock-model');

// Gets all the stocks currently stored in the database
exports.getStocks = function(renderCb) {
    Stock.find({}, function(err, docs) {
        if (err) console.log(err);

        var stocks = [];

        docs.forEach(function(stock) {
            stocks.push({
                identifier: stock.identifier,
                data: stock.data
            });
        });
        renderCb(stocks);
    })
};

// Remove a stock from the database
exports.removeStock = function(symbol, renderCb) {
    var query = { identifier: symbol };

    Stock.findOne(query, function(err, doc) {
        if (err) console.log(err);

        doc.remove();
        renderCb();
    })
};
