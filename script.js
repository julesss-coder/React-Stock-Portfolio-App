function StockInputForm(props) {
  const {handleChange, name, value} = props;

  return (
    <input onChange={handleChange} type="number" name={name} value={value} />
  )
}

function Stock(props) {
  let {stock, handleChange, removeStock} = props;
  let {name, shares_owned, cost_per_share, market_price} = stock;

  let market_value = shares_owned * market_price;
  let gain_loss = market_value - (shares_owned * cost_per_share);

  return (
    <tr>
      <td>{name}</td>
      <td>
        <StockInputForm handleChange={handleChange} name={"shares_owned"} value={shares_owned}/>
      </td>
      <td>
        <StockInputForm handleChange={handleChange} name={"cost_per_share"} value={cost_per_share}/>
      </td>
      <td>
        <StockInputForm handleChange={handleChange} name={"market_price"} value={market_price}/>
      </td>
      <td>{market_value}</td>
      <td>{gain_loss}</td>
      <td>
        <button onClick={removeStock} className="btn btn-light btn-sm">Remove</button>
      </td>
    </tr>
  )
}


class AddStockInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      shares_owned: 0,
      cost_per_share: 0,
      market_price: 0
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleInputChange(event) {
    // Set input of add stock input fields
    let {name, value} = event.target;
    this.setState({
      [name]: value,
    });
  }
  

  handleSubmit() {    
    let {name, shares_owned, cost_per_share, market_price} = this.state;

    // props.onSubmit was passed into AddStockInput from StockPortfolio
    // i.e. we are calling addStock and passing in the new stock
    this.props.onSubmit({
      name, 
      shares_owned,
      cost_per_share,
      market_price
    });

    // Reset input form to initial state
    this.setState({
      name: '',
      shares_owned: 0,
      cost_per_share: 0, 
      market_price: 0,
    });
  }

  render() {
    let {name, shares_owned, cost_per_share, market_price} = this.state;

    return(
      <div className="row">
          <div className="col">
            <div className="add-stock input-group mt-3">
              <input 
                type="text" 
                aria-label="Name" 
                name="name"
                placeholder="Name" 
                // className="form-control" 
                value={name}
                onChange={this.handleInputChange}
              />
              <input 
                type="number" 
                aria-label="Shares" 
                name="shares_owned"
                placeholder="Shares" 
                // className="form-control" 
                value={shares_owned}
                onChange={this.handleInputChange}
              />            
              <input 
                type="number" 
                aria-label="Cost" 
                name="cost_per_share"
                placeholder="Cost" 
                // className="form-control" 
                value={cost_per_share}
                onChange={this.handleInputChange}
              />
              <input 
                type="number" 
                aria-label="Market price" 
                name="market_price"
                placeholder="Market price" 
                // className="form-control" 
                value={market_price}
                onChange={this.handleInputChange}
              />
              <button 
                onClick={this.handleSubmit} 
                className="btn btn-primary" 
                type="button" 
                id="button-addon2">
                  Add
              </button>
            </div>
          </div>
        </div>
    )
  }
}

// StockPortfolio only needs the new stock data from AddStockInput. That's why we can move the form state, as well as handleInputChange() into AddStockInput()
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
    }

    this.removeStock = this.removeStock.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addStock = this.addStock.bind(this);
  }


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


  handleChange(event, index) {
    let {name, value} = event.target;
    let editedPortfolio = this.state.portfolio.slice();
    editedPortfolio[index][name] = Number(value);

    this.setState({
      portfolio: editedPortfolio
    });
  }


  addStock(stock) {
    let newPortfolio = this.state.portfolio.slice().concat(stock);
    
    this.setState({
      portfolio: newPortfolio
    });
  }

  render() {
    // For each stock in portfolio, destructure this.state.portfolio and create the specified table row
    const stockRows = this.state.portfolio.map((stock, index) => {
      const {
        name, 
        shares_owned, 
        cost_per_share, 
        market_price
      } = stock;

      // QUESTION: Why do I get an error, saying that:
      // react_devtools_backend.js:4026 Warning: Stock: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)
      return (
        <Stock key={name} stock={stock} index={index} handleChange={(event) => this.handleChange(event, index)} removeStock={() => this.removeStock(name)} />
      );
    });

    const {portfolio} = this.state;

    // Calculate portfolio value 
    let portfolio_market_value = portfolio.reduce((portfolio_sum, stock) => {
      return portfolio_sum + (stock.shares_owned * stock.market_price);
    }, 0);

    // Calculate portfolio gain/loss
    // Gains/losses = portfolio market value - portfolio cost
    let portfolio_cost = portfolio.reduce((portfolio_cost, stock) => portfolio_cost + (stock.shares_owned * stock.cost_per_share), 0);

    let portfolio_gains_losses = portfolio_market_value - portfolio_cost;

    return(
      <div className="container stock-portfolio mt-5 d-flex justify-content-center">
        <div className="display-portfolio">
          <div className="row">
            <div className="col-auto">
            <h1 className="text-center mb-3">Stock Portfolio</h1>
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


          <AddStockInput onSubmit={this.addStock} />

          <div className="row mt-3">
            <div className="col">
              <div className="portfolio-summary">
                <p className="me-5">Portfolio market value: ${portfolio_market_value}</p>
                <p>Portfolio gain/loss: ${portfolio_gains_losses}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }  
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<StockPortfolio />);