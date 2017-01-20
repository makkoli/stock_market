var searchController = require('../controllers/search-controller'),
    stockController = require('../controllers/stock-controller');

// Render index page
exports.index = function(req, res) {
    res.render('index');
};

// Get current stocks
exports.getStocks = function(req, res) {
    stockController.getStocks(function(data) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(JSON.stringify(data));
    });
};

// User searching for a stock ticker
exports.search = function(req, res) {
    searchController.getStockData(req.query.symbol,
        // Invalid symbol render callback
        function() {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('invalid');
        },
        // Stock data returned render
        function(data) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(JSON.stringify(data));
        }
    );
};
