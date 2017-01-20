// Stocks container; handle state changes in applcation
var Stocks = React.createClass({
    getInitialState: function() {
        return {
            searchSymbol: "",
            stocks: [],
            invalid: false
        };
    },

    // Retrieve current stocks
    componentDidMount: function() {
        var self = this;

        axios.get('/get-stocks')
            .then(function(response) {
                self.setState({
                    stocks: response.data
                });
            })
            .catch(function(error) {
                console.log(error);
                var errorNode = document.createElement('p');
                errorNode.appendChild(document.createTextNode('Error with request'));
                document.querySelector("#stocks").appendChild(errorNode);
            });
    },

    // submit a search using ajax
    submit: function(event) {
        event.preventDefault();
        this.getSearch(this.state.searchSymbol);
    },

    // Sends a request to the server to get the locales
    getSearch: function(searchSymbol) {
        var self = this;

        axios.post('/search/?symbol=' + searchSymbol, {})
            .then(function(response) {
                console.log(response);
                // Invalid symbol
                if (response.data === 'invalid') {
                    self.setState({
                        invalid: true
                    });
                }
                // Else, we got a valid response to the stock symbol
                else {
                    self.setState({
                        invalid: false,
                        stocks: self.state.stocks.concat([{
                            identifier: response.data.identifier,
                            data: response.data.data
                        }])
                    });
                }
            })
            .catch(function(error) {
                console.log(error);
                var errorNode = document.createElement('p');
                errorNode.appendChild(document.createTextNode('Error with request'));
                document.querySelector("#stocks").appendChild(errorNode);
            });
    },

    // Update the search term as the user inputs it
    searchChange: function(event) {
        this.setState({ searchSymbol: event.target.value });
    },

    render: function() {
        console.log(this.state.stocks);
        return (
            <div>
                <StocksContainer stocks={this.state.stocks} />
                <SearchForm submit={this.submit}
                    searchChange={this.searchChange} />
                <Invalid display={this.state.invalid} />
            </div>
        );
    }
});

// Presentation container component holding all the stocks
var StocksContainer = React.createClass({
    render: function() {
        var stocks = [];

        this.props.stocks.forEach(function(stock) {
            console.log(stock);
            stocks.push(<Stock id={stock.identifier} key={stock.identifier} />);
        });

        return (
            <div>
                { stocks }
            </div>
        );
    }
});

// Presentation component holding a single stock
var Stock = React.createClass({
    render: function() {
        return (
            <div>
                { this.props.id }
            </div>
        );
    }
});

// Presentation component for input form of stock symbols
var SearchForm = React.createClass({
    render: function() {
        return (
            <form onSubmit={this.props.submit} className="form-inline">
                <div className="form-group">
                    <input type="text" name="search" className="form-control"
                        placeholder="Stock Symbol"
                        onChange={this.props.searchChange} />
                </div>
                <button className="btn btn-primary" type="submit">
                    Get Stock
                </button>
            </form>
        );
    }
});

// Presentation component of invalid stock symbol requests
var Invalid = React.createClass({
    render: function() {
        return (
            <p>{this.props.display ? "Invalid Stock Symbol" : ""}</p>
        );
    }
});

ReactDOM.render(<Stocks />, document.getElementById('stocks'));
