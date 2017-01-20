'use strict';

// Stocks container; handle state changes in applcation
var Stocks = React.createClass({
    displayName: 'Stocks',

    getInitialState: function getInitialState() {
        return {
            searchSymbol: "",
            stockSymbols: [],
            invalid: false
        };
    },

    // submit a search using ajax
    submit: function submit(event) {
        event.preventDefault();
        this.getSearch(this.state.searchSymbol);
    },

    // Sends a request to the server to get the locales
    getSearch: function getSearch(searchSymbol) {
        var self = this;

        axios.post('/search/?symbol=' + searchSymbol, {}).then(function (response) {
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

    render: function render() {
        return React.createElement(
            'div',
            null,
            React.createElement(SearchForm, { submit: this.submit,
                searchChange: this.searchChange }),
            React.createElement(Invalid, { display: this.state.invalid })
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