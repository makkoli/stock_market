var express = require('express'),
    MongoClient = require('mongodb').MongoClient,
    bodyParser = require('body-parser'),
    helmet = require('helmet'),
    mongoose = require('mongoose'),
    site = require('./routes/site'),
    WebSocket = require('ws'),
    StockModel = require('./models/stock-model'),
    StockController = require('./controllers/stock-controller'),
    SearchController = require('./controllers/search-controller'),
    app = express(),
    server = require('http').createServer();

var dbConnStr = 'mongodb://localhost:27017/stock';
// Connect mongoose to db
mongoose.connect(dbConnStr, function(err) {
    if (err)
        throw err;
    console.log('Connected to mongodb');
});

// Length of cache for static files
var oneDay = 86400000;

// static files
app.use(express.static(__dirname + '/public', {maxAge: oneDay}));
// parse body for POST sent by user
app.use(bodyParser.urlencoded({extended: true}));
// views
app.set("views", __dirname + "/views");
app.set("view engine", "pug");
// helmet for security
app.use(helmet());

// Home page
app.get('/', site.index);

// Start web socket server
var wsServer = new WebSocket.Server({server: server});
var wsClients = [];
wsServer.on('connection', function(ws) {
    wsClients.push(ws); // add client

    // initialize by getting the stocks
    StockController.getStocks(function(stocks) {
        var data = {
            operation: "init",
            data: stocks
        };
        ws.send(JSON.stringify(data));
    });
    // Take the appropriate action depending on what the client sends
    ws.on('message', function(data) {
        var data = data.split(',');
        var operation = data[0];
        var symbol = data[1];

        // add a stock
        if (operation === "add") {
            SearchController.addStockData(symbol,
                function() {
                    var data = {
                        operation: "add",
                        data: "invalid"
                    };
                    ws.send(JSON.stringify(data));
                }, function(stock) {
                    var data = {
                        operation: "add",
                        data: stock
                    };

                    // send added stock to all clients
                    wsClients.forEach(function(ws) {
                        ws.send(JSON.stringify(data));
                    })
                });
        }
        // else, remove it
        else {
            StockController.removeStock(symbol, function(symbol) {
                var data = {
                    operation: "remove",
                    data: symbol
                }

                wsClients.forEach(function(ws) {
                    ws.send(JSON.stringify(data));
                });
            });
        }
    });

    // Remove ws from client list once user leaves
    ws.on('close', function() {
        wsClients = wsClients.filter(function(wsClient) {
            return wsClient !== ws;
        });
    });
});

// Start server
server.on('request', app);
server.listen(8000, function() {
    var port = server.address().port;
    console.log('Express server listening on port %s.', port);
});
