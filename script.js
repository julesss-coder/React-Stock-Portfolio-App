// TO-DO: CONTINUE with paragraph "Remove a stock"

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
      ]
    }
  }

  render() {
    // For each stock in portfolio, destructure this.state.portfolio and create the specified table row
    const stockRows = this.state.portfolio.map(stock => {
      const {
        name, 
        shares_owned, 
        cost_per_share, 
        market_price
      } = stock;

      let market_value = shares_owned * market_price;
      let gain_loss = market_value - (shares_owned * cost_per_share);

      return (
        <tr key={name}>
          <td>{name}</td>
          <td>
            <input type="number" name="shares_owned" value={shares_owned} />
          </td>
          <td>
          <input type="number" name="cost_per_share" value={cost_per_share} />
          </td>
          <td>
            <input type="number" name="market_price" value={market_price} />
          </td>
          <td>{market_value}</td>
          <td>{gain_loss}</td>
          <td>
            <button className="btn btn-light btn-sm">Remove</button>
          </td>
        </tr>
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
      <div className="container stock-portfolio">
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
              <input type="text" aria-label="Name" placeholder="Name" className="form-control" />
              <input type="text" placeholder="Shares" aria-label="Shares" className="form-control" />            
              <input type="text" placeholder="Cost" aria-label="Cost" className="form-control" />
              <input type="text" placeholder="Price" aria-label="Price" className="form-control" />
              <button className="btn btn-outline-secondary" type="button" id="button-addon2">Add</button>
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