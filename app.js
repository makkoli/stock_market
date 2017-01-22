var express = require('express'),
    MongoClient = require('mongodb').MongoClient,
    bodyParser = require('body-parser'),
    helmet = require('helmet'),
    mongoose = require('mongoose'),
    site = require('./routes/site'),
    app = express();

var dbConnStr = 'mongodb://localhost:27017/stock';
// Connect mongoose to db
mongoose.connect(dbConnStr, function(err) {
    if (err) throw err;
    console.log('Connected to mongodb');
});

// Length of cache for static files
var oneDay = 86400000;

// static files
app.use(express.static(__dirname + '/public', { maxAge: oneDay }));
// parse body for POST sent by user
app.use(bodyParser.urlencoded({ extended: true }));
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

var server = app.listen(8000, function() {
    var port = server.address().port;
    console.log('Express server listening on port %s.', port);
});
