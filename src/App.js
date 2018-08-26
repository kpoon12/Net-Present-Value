import React, { Component } from 'react';
import './App.css';

var ReactBsTable  = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;

//Table data
var npvs = [];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      analysisdata: "",
      discountrate: "4",
      cashflows: "1/1/2019    -5,000.00\n1/1/2020    1,000.00\n1/1/2021    1,000.00\n1/1/2022    1,000.00\n1/1/2023    4,000.00",
      npvtotal: 0
    };
    
    // This binding is necessary to make `this` work in the callback
    this.NPVC = this.NPVCalculate.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  //input handle and update change
  handleChange(event) {
    switch(event.target.id)
    {
      case "analysisdata":
        this.setState({ analysisdata: event.target.value });
        break;
      case "discountrate":
        this.setState({ discountrate: event.target.value });
        break;
      case "cashflows":
        this.setState({ cashflows: event.target.value });
        break;
      default:
        console("error input");
        break;
    }
  }

  //Calcalate NPV using user input
  NPVCalculate(){
    var lines = this.state.cashflows.split("\n");
    npvs = [];
    var sumnpv = 0;
    for(var i = 0; i < lines.length; i++)
    { 
      var oneCalculation = {date:0, cash:0, npv:0};
      var fixthestring = lines[i].replace(',', '');
      var cells = fixthestring.split('   ');
      if(cells.length > 1){
        var R = this.state.discountrate;
        var C = parseFloat(cells[1]);
        var D = this.DateDiff( new Date(this.state.analysisdata), new Date(cells[0]) ) -1;
        oneCalculation.date = cells[0];
        oneCalculation.cash = cells[1];
        oneCalculation.npv = Math.round((C / Math.pow((1+R/100),(D/365)))* 100)/100;
        //sum npv
        sumnpv += oneCalculation.npv;
        const npvtotal = Math.round(sumnpv*100)/100;
        this.setState({npvtotal});
        npvs.push(oneCalculation);
      }
    }
    this.renderPosts();  
  }
  
  //Calculate the date different
  DateDiff(date1, date2) {
    date1.setHours(0);
    date1.setMinutes(0, 0, 0);
    date2.setHours(0);
    date2.setMinutes(0, 0, 0);
    var datediff = Math.abs(date1.getTime() - date2.getTime()); // difference 
    return parseInt(datediff / (24 * 60 * 60 * 1000), 10); //Convert values days and return value      
  }
  
  //Table render
  renderPosts() {
    return (
      <div>
        <BootstrapTable data={ npvs } striped hover condensed>
          <TableHeaderColumn dataField='date' width={'20%'} isKey>Date</TableHeaderColumn>
          <TableHeaderColumn dataField='cash' width={'20%'}>Cash Flow</TableHeaderColumn>
          <TableHeaderColumn dataField='npv' width={'20%'}>NPV</TableHeaderColumn>
        </BootstrapTable>
        <h3>NPV {this.state.npvtotal}</h3> 
      </div>
    );
  }

  componentDidMount(){
    var d = new Date("4/1/2018").toISOString().split('T')[0];
    this.setState({ analysisdata: d});
  }

  componentWillUnmount(){
  }

  render() {
    const style = {
      maxHeight:'400px',
      minHeight:'200px',
      resize:'none',
      padding:'9px',
      boxSizing:'border-box',
      fontSize:'15px'};

    return (
      <div>
        <div  className="App">
          <h2>Analysis Date</h2>
          <input type='date' value={this.state.analysisdata}
              onChange={this.handleChange} id='analysisdata'/>
          <h2>Discount Rate</h2>
          <input type="text" value={this.state.discountrate}
               onChange={this.handleChange} id='discountrate'/>
          <h2>Cash Flows</h2>
          <textarea type="text" value={this.state.cashflows} style={style} onChange={this.handleChange} id='cashflows'></textarea>
          <br></br>
          <button onClick={this.NPVC}>Calculate NPV</button>
        </div>
        <div className="Result">
          {this.renderPosts()}
        </div>
      </div>
    );
  }
}

export default App;
