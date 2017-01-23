var express = require('express'),
    MongoClient = require('mongodb').MongoClient,
    bodyParser = require('body-parser'),
    helmet = require('helmet'),
    mongoose = require('mongoose'),
    site = require('./routes/site'),
    WebSocket = require('ws'),
    StockModel = require('./models/stock-model'),
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

// Retrieve current stocks
app.get('/get-stocks', site.getStocks)

// Search for a new stock
app.post('/search', site.search);

// Remove a stock
app.post('/remove-stock', site.removeStock);

// Start web socket server
var wsServer = new WebSocket.Server({server: server});
var wsClients = [];
wsServer.on('connection', function(ws) {
    wsClients.push(ws);
    // Send all the stocks once a client has changed one of them
    ws.on('message', function() {
        StockModel.find({}, function(err, docs) {
            if (err) console.log(err);

            var stocks = [];

            docs.forEach(function(stock) {
                stocks.push({
                    identifier: stock.identifier,
                    data: stock.data
                });
            });

            // Send to all clients
            wsClients.forEach(function(ws) {
                ws.send(JSON.stringify(stocks));
            });
        });
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
