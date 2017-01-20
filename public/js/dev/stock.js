// Stocks container; handle state changes in applcation
var Stocks = React.createClass({
    getInitialState: function() {
        return {
            searchSymbol: "",
            stockSymbols: [],
            invalid: false
        };
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
                        invalid: false
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
        return (
            <div>
                <SearchForm submit={this.submit}
                    searchChange={this.searchChange} />
                <Invalid display={this.state.invalid} />
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
