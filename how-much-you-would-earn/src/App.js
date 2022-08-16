
import './App.css';
import React from 'react';

class App extends React.Component{

    state = {
      bitcoin: {},
      isLoaded: false, 
      date_price: {},
      date_price_loaded: false,
      earning: null,
      profit: null,
      percent_profit: null
    }

    
    componentDidMount(){
      fetch('https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD')
      .then(responce => responce.json())
      .then(data => this.setState({
        bitcoin: data,
        isLoaded: true
      }))
    }

  DateEvent = (e) => {
    e.preventDefault();

    let date = e.target.value.replaceAll('-', '/')
    let format_date = date.substr(5,7) + '/' + date.substr(0,4)
    let toTimestamp = strDate => Date.parse(strDate) / 1000 + 86399

    fetch(`https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=1&toTs=${toTimestamp(format_date)}`)
      .then(responce => responce.json())
      .then(data => this.setState({
        date_price: data.Data.Data[1],
        date_price_loaded: true
      }))
  }

  CountInvestment = (e) => {
    e.preventDefault();

    const{bitcoin, isLoaded, date_price, date_price_loaded} = this.state

    if(isLoaded & date_price_loaded){
      let invest_amount = Number(e.target.value)

      let percent = (bitcoin.USD / date_price.open) * 100 - 100
      let profit = percent * invest_amount / 100
      let earning = invest_amount + profit
      
      this.setState({
        earning: earning.toFixed(1),
        profit: profit.toFixed(1),
        percent_profit: percent.toFixed(1)
      })
    }
    
  }
  
  render(){
    const{bitcoin, isLoaded, date_price, date_price_loaded, earning, profit, percent_profit} = this.state

    let max_date = new Date().toLocaleDateString('en-ca')

    if(!isLoaded){
      return (
            <div className='d-flex justify-content-center'>
              <div className="spinner-border text-danger" role="status">
                <span className="sr-only"></span>
              </div>
            </div>  
              )
    } else{
      return (
      <>
        <nav className="navbar bg-warning">
          <div className="container-fluid">
            <span className="navbar-brand mb-0 h1">How much would you earn if you invested in bitcoin?</span>
          </div>
        </nav>
        <div className='bg-warning main-form'>
        <div className="mb-3">
          <label className="form-label">Date of bitcoin purchase  (min 17.07.2010)</label>
          <input type="date" min='2010-07-17' max={max_date} className="form-control" onChange={this.DateEvent}></input>
        </div>
          <label className="form-label">Amount of investment</label>
          <input type="number" className="form-control" min='0' onChange={this.CountInvestment}></input>
          <div class='percent-text'>
            <p>Your income: {earning} $</p>
            <p>Your profit: {profit} $ ({percent_profit} %)</p>
          </div>
        </div>
      </>
      )
    }
  }
}

export default App;
