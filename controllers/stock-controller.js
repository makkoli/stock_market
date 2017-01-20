var Stock = require('../models/stock-model');

exports.getStocks = function(renderCb) {
    Stock.find({}, function(err, stocks) {
        if (err) console.log(err);

        renderCb(stocks);
    })
};
