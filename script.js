// *What is state in this app?*
// initial portfolio: is changed by user
// user input:
  // a: add new stock
  // b: changes to existing stock (shares owned cost, price)
  // c: removal of stock
// STATE => portfolio data (initial and user input) are a state
// portfolio value, gain and loss: no state, as it doesn't change the data

// *What I want to happen:*
// User clicks remove button -> this stock is removed from state and DOM -- OK 
// User changes data of individual stock -> state, market value, gainLoss, data summary update -- OK 
// User adds new stock -> stock is added to state -- OK


class StockPortfolio extends React.Component {  
  constructor(props) {
    super(props);
    this.state = {
      portfolio: [
        {
          name: 'Feetbook', 
          shares_owned: 20,
          cost_per_share: 50,
          market_price: 130
        },
        {
          name: 'Yamazon',
          shares_owned: 5,
          cost_per_share: 200,
          market_price: 500
        },
        {
          name: 'Snoozechat',
          shares_owned: 100,
          cost_per_share: 20,
          market_price: 3
        }
      ], 
      form: {
        name: '',
        shares_owned: 0,
        cost_per_share: 0,
        market_price: 0
      }
    }

    this.removeStock = this.removeStock.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.addStock = this.addStock.bind(this);
  }

  /* === REMOVE A STOCK === */
  // What do we need the key for if we don't use it to get the stock we want to delete?
    // Experiment: delete the key that is assigned in the map callback that is called inside render(), to assign a value to `stockRows`.
    // Result: 
      // Console shows warning: "Warning: Each child in a list should have a unique "key" prop."
      // Everything works as before!!

  // `name` was passed in as the value of event handler `onClick`, and it was accessible because at that point, we were inside a map callback with access to stock.name.
  removeStock(name) {
    let newPortfolio = this.state.portfolio.slice();

    newPortfolio = newPortfolio.filter(stock => {
      // return only those stocks that do NOT have the name of the stock to be removed
      return stock.name !== name;
    });

    this.setState({
      portfolio: newPortfolio
    });
  }

  /* === HANDLE CHANGES TO INPUT IN MAIN STOCK DISPLAY === */
  handleChange(event, index) {
    let {name, value} = event.target;
    let editedPortfolio = this.state.portfolio.slice();
    editedPortfolio[index][name] = value;

    this.setState({
      portfolio: editedPortfolio
    });
  }

  /* === HANDLE CHANGE TO INPUT FIELDS IN ADD-STOCK-AREA === */
  handleInputChange(event) {
    let {name, value} = event.target;
    let {form} = this.state;
    form[name] = value;
    this.setState({form});
  }

  /* === ADD A STOCK === */
  addStock() {
    this.setState({
      portfolio: this.state.portfolio.concat([this.state.form]),
      form: {
        name: '',
        shares_owned: 0,
        cost_per_share: 0,
        market_price: 0
      }
    });
  }

  // VERSION 1 of addStock: This only works if the input fields are NOT controlled components.
  // I added version 2 (above) where the state controls the value of the input fields.
  // addStock(event) {
  //   let newStockInputFields = event.target.parentElement.children;

  //   let newStock = {
  //     name: newStockInputFields[0].value, 
  //     shares_owned: Number(newStockInputFields[1].value),
  //     cost_per_share: Number(newStockInputFields[2].value),
  //     market_price: Number(newStockInputFields[3].value)
  //   };

  //   this.setState({
  //     portfolio: this.state.portfolio.concat([newStock])
  //   });

  //   for (let i = 0; i < newStockInputFields.length - 1; i++) {
  //     newStockInputFields[i].value = '';
  //   }
  // }

  render() {
    // For each stock in portfolio, destructure this.state.portfolio and create the specified table row
    const stockRows = this.state.portfolio.map((stock, index) => {
      const {
        name, 
        shares_owned, 
        cost_per_share, 
        market_price
      } = stock;

      let market_value = shares_owned * market_price;
      let gain_loss = market_value - (shares_owned * cost_per_share);

      // Why do I have access to `name` inside the onClick prop?
      // Because we are in a map callback. Inside it, we have access to the properties of `stock`, which we destructered.

      // Q: Is `onClick` a prop, or an event handler, an attribute, or what?
      // A: `onClick' is an event handler that is passed as props to handleClick. See URL: https://reactjs.org/docs/faq-functions.html#how-do-i-pass-an-event-handler-like-onclick-to-a-component
      return (
        <tr key={name}>
          <td>{name}</td>
          <td>
            <input onChange={(event) => this.handleChange(event, index)} type="number" name="shares_owned" value={shares_owned} />
          </td>
          <td>
          <input onChange={(event) => this.handleChange(event, index)} type="number" name="cost_per_share" value={cost_per_share} />
          </td>
          <td>
            <input onChange={(event) => this.handleChange(event, index)} type="number" name="market_price" value={market_price} />
          </td>
          <td>{market_value}</td>
          <td>{gain_loss}</td>
          <td>
            <button onClick={() => this.removeStock(name)} className="btn btn-light btn-sm">Remove</button>
          </td>
        </tr>
      );
    });

    const {portfolio, form} = this.state;

    // Calculate portfolio value 
    let portfolio_market_value = portfolio.reduce((portfolio_sum, stock) => {
      return portfolio_sum + (stock.shares_owned * stock.market_price);
    }, 0);

    // Calculate portfolio gain/loss
    // Gains/losses = portfolio market value - portfolio cost
    let portfolio_cost = portfolio.reduce((portfolio_cost, stock) => portfolio_cost + (stock.shares_owned * stock.cost_per_share), 0);

    let portfolio_gains_losses = portfolio_market_value - portfolio_cost;

    return(
      <div className="container stock-portfolio mt-5">
        <h1 className="text-center">Stock Portfolio</h1>
        <div className="display-portfolio">
          <div className="row">
            <div className="col-12">
              <table className="table table-responsive">
                <thead>
                  <tr>
                    <th scope="col-" className="table-primary">Name</th>
                    <th scope="col-" className="table-primary">Shares Owned</th>
                    <th scope="col" className="table-primary">Cost per Share ($)</th>
                    <th scope="col" className="table-primary">Market Price ($)</th>
                    <th scope="col" className="table-primary">Market Value ($)</th>
                    <th scope="col" className="table-primary">Unrealized Gain/Loss ($)</th>
                    <th scope="col" className="table-primary"></th>
                  </tr>
                </thead>
                <tbody>
                  {stockRows}
                </tbody>
              </table>
            </div>
          </div>
        </div>
          
        <div className="row">
          <div className="col-10">
            <div className="add-stock input-group">
              <input 
                type="text" 
                aria-label="Name" 
                name="name"
                placeholder="Name" 
                // className="form-control" 
                value={form.name}
                onChange={(event) => this.handleInputChange(event)}
              />
              <input 
                type="number" 
                aria-label="Shares" 
                name="shares_owned"
                placeholder="Shares" 
                // className="form-control" 
                value={form.shares_owned}
                onChange={(event) => this.handleInputChange(event)}
              />            
              <input 
                type="number" 
                aria-label="Cost" 
                name="cost_per_share"
                placeholder="Cost" 
                // className="form-control" 
                value={form.cost_per_share}
                onChange={(event) => this.handleInputChange(event)}
              />
              <input 
                type="number" 
                aria-label="Market price" 
                name="market_price"
                placeholder="Market price" 
                // className="form-control" 
                value={form.market_price}
                onChange={(event) => this.handleInputChange(event)}
              />
              <button 
                onClick={this.addStock} 
                className="btn btn-outline-secondary" 
                type="button" 
                id="button-addon2">
                  Add
              </button>
            </div>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col">
            <div className="portfolio-summary">
              <p className="d-inline-block me-5 ">Portfolio market value: ${portfolio_market_value}</p>
              <p className="d-inline-block">Portfolio gain/loss: ${portfolio_gains_losses}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }  
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<StockPortfolio />);