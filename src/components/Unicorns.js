import React, { Component } from 'react';
import unicorn_small from '../images/unicorn_small.png';
import Amplify,{API,graphqlOperation} from 'aws-amplify';
import aws_exports from '../aws-exports'; // specify the location of aws-exports.js file on your project
Amplify.configure(aws_exports);

//GraphQL
const listInventory = `query {
  listInventory{
    items{
        itemId
        itemDescription
        price
        count
    }
  }
}`

class Unicorns extends Component {

  constructor(props){
    super(props);
    this.state={
      unicorns: []
    }
  }
  
  //Retrieve Unicorns available with details
  async componentDidMount() {
   this.unicorns = await API.graphql(graphqlOperation(listInventory));
    this.setState({unicorns:this.unicorns.data.listInventory.items});
    console.log(this.state.unicorns);
  }
  
  //Update order values on change
  onChange = (index, val) => {
      this.setState({
        unicorns: this.state.unicorns.map((unicorn, i) => (
          i === index ? {...unicorn, count: val} : unicorn
        ))
      })
    }
    
  //Send order to main App component  
  purchase = () => {
    let total = this.state.unicorns.reduce((sum, i) => (sum += i.count * i.price), 0);
    let balance = this.props.points;
    let orderDetails = this.state.unicorns;
    //Check balance and deny purchase if there's not enough points
    balance = balance - total;
    if (balance < 0){
      alert("Not enough Unicoins :(")
    } else {
      this.props.order(orderDetails,balance,total);
    }
  }

render () {
    return (
      <div className="card p-3">
        <UnicornList unicorns={this.state.unicorns} onChange={this.onChange} />
        <Total unicorns={this.state.unicorns} />
        <p/>
        <button className="btn btn-primary" onClick={this.purchase}>Order</button>
      </div>
    )
  }
};

//Map Unicorn Data
const UnicornList = ({ unicorns, onChange }) => (
  <form>
    {unicorns.map((unicorn, i) => (
    <table key={i} className="table table-hover table-borderless">
      <tbody key={i}>
        <tr className="p-0">
          <td className="center align-middle p-0"><img className="img-thumbnail img-responsive img-circle mt-0 mb-1" src={unicorn_small} alt="Unicorn"/></td>
          <td className="text-left align-middle pl-3">{unicorn.itemDescription} (Uni${unicorn.price}) </td>
          <td className="align-middle pr-2"> <input 
          className="border border-secondary rounded"
          type="number" 
          value={unicorn.count}
          onChange={e => onChange(i, parseInt(e.target.value) || 0)}
        /></td>
        </tr>
       </tbody>
      </table>
    ))}
    <br/>
  </form>
);

//Calculate Total 
const Total = ({ unicorns }) => (
 <table className="table table-borderless">
  <tbody>
    <tr className="p-0">
      <td className="text-right">
        <span className="pr-1">Total:</span>
        <span className="bg-light border border-secondary rounded p-2"> 
          {unicorns.reduce((sum, i) => (sum += i.count * i.price), 0) }
        </span>
      </td>
    </tr>
  </tbody>
</table>
)


export default Unicorns;