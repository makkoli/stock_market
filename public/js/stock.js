'use strict';

// Stocks container; handle state changes in applcation
var Stocks = React.createClass({
    displayName: 'Stocks',

    getInitialState: function getInitialState() {
        return {
            searchSymbol: "",
            stocks: [],
            invalid: false
        };
    },

    // Retrieve current stocks
    componentDidMount: function componentDidMount() {
        var self = this;

        axios.get('/get-stocks').then(function (response) {
            console.log(response);
            response.data.forEach(function (stock) {
                stockChart.addStock(stock);
            });
            self.setState({
                stocks: response.data
            });
        }).catch(function (error) {
            console.log(error);
            var errorNode = document.createElement('p');
            errorNode.appendChild(document.createTextNode('Error with request'));
            document.querySelector("#stocks").appendChild(errorNode);
        });
    },

    // submit a search using ajax
    submit: function submit(event) {
        event.preventDefault();
        var self = this;

        // if stock is already present
        if (this.state.stocks.some(function (stock) {
            return self.state.searchSymbol === stock.identifier;
        })) {}
        // do nothing

        // else, retrieve new stock
        else {
                this.getSearch(this.state.searchSymbol);
            }
    },

    // Sends a request to the server to get the locales
    getSearch: function getSearch(searchSymbol) {
        var self = this;

        axios.post('/search/?symbol=' + searchSymbol, {}).then(function (response) {
            // Invalid symbol
            if (response.data === 'invalid') {
                self.setState({
                    invalid: true
                });
            }
            // Else, we got a valid response to the stock symbol
            else {
                    // Update chart
                    stockChart.addStock({
                        identifier: response.data.identifier,
                        data: response.data.data
                    });

                    // Update state
                    self.setState({
                        invalid: false,
                        stocks: self.state.stocks.concat([{
                            identifier: response.data.identifier,
                            data: response.data.data
                        }])
                    });
                }
        }).catch(function (error) {
            console.log(error);
            var errorNode = document.createElement('p');
            errorNode.appendChild(document.createTextNode('Error with request'));
            document.querySelector("#stocks").appendChild(errorNode);
        });
    },

    // Update the search term as the user inputs it
    searchChange: function searchChange(event) {
        this.setState({ searchSymbol: event.target.value });
    },

    removeStock: function removeStock(stockId) {
        var self = this;

        axios.post('/remove-stock?symbol=' + stockId, {}).then(function (response) {
            stockChart.removeStock(stockId);

            self.setState({
                stocks: self.state.stocks.filter(function (stock) {
                    return stock.identifier !== stockId;
                })
            });
        });
    },

    render: function render() {
        return React.createElement(
            'div',
            null,
            React.createElement(StocksContainer, { stocks: this.state.stocks,
                removeStock: this.removeStock }),
            React.createElement(SearchForm, { submit: this.submit,
                searchChange: this.searchChange }),
            React.createElement(Invalid, { display: this.state.invalid })
        );
    }
});

// Presentation container component holding all the stocks
var StocksContainer = React.createClass({
    displayName: 'StocksContainer',

    render: function render() {
        var stocks = [];
        var self = this;

        this.props.stocks.forEach(function (stock) {
            stocks.push(React.createElement(Stock, { id: stock.identifier, key: stock.identifier,
                removeStock: self.props.removeStock }));
        });

        return React.createElement(
            'div',
            { className: 'stocks-container' },
            stocks
        );
    }
});

// Presentation component holding a single stock
var Stock = React.createClass({
    displayName: 'Stock',

    render: function render() {
        return React.createElement(
            'div',
            { className: 'stock' },
            this.props.id,
            React.createElement(
                'button',
                { type: 'button', className: 'close', 'aria-label': 'close',
                    onClick: this.props.removeStock.bind(null, this.props.id) },
                React.createElement(
                    'span',
                    { 'aria-hidden': 'true' },
                    '\xD7'
                )
            )
        );
    }
});

// Presentation component for input form of stock symbols
var SearchForm = React.createClass({
    displayName: 'SearchForm',

    render: function render() {
        return React.createElement(
            'form',
            { onSubmit: this.props.submit, className: 'form-inline' },
            React.createElement(
                'div',
                { className: 'form-group' },
                React.createElement('input', { type: 'text', name: 'search', className: 'form-control',
                    placeholder: 'Stock Symbol',
                    onChange: this.props.searchChange })
            ),
            React.createElement(
                'button',
                { className: 'btn btn-primary', type: 'submit' },
                'Get Stock'
            )
        );
    }
});

// Presentation component of invalid stock symbol requests
var Invalid = React.createClass({
    displayName: 'Invalid',

    render: function render() {
        return React.createElement(
            'p',
            null,
            this.props.display ? "Invalid Stock Symbol" : ""
        );
    }
});

ReactDOM.render(React.createElement(Stocks, null), document.getElementById('stocks'));