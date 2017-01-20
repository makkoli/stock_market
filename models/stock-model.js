var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Stock schema in mongo
var StockSchema = new Schema({
    // identifying symbol
    symbol: {
        type: String,
        required: true,
        index: { unique: true }
    },
    // stock history over the last year
    data: {
        type: Object,
        required: true
    },
    // keep track if we need to update the stock
    lastUpdate: {
        type: Date,
        required: true
    }},
    {
        collection: 'stocks'
    }
);

module.exports = mongoose.model('Stocks', StockSchema);
