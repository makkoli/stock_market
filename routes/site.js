var searchController = require('../controllers/search');

// Render index page
exports.index = function(req, res) {
    res.render('index');
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
