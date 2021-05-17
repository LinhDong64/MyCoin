import { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Login from './components/WalletActions'
import BlockchainExplorer from './components/BlockchainExplorer'
import NavBar from './components/NavBar';
import Block from './components/Block';
import Wallet from './components/Wallet'
import Address from './components/Address'
import Transaction from './components/Transaction'

const axios = require('axios').default;

// const EC = require('elliptic').ec

class App extends Component {

  constructor(props) {
    super(props);

    this.state={
      blockchain: []
    }
    this.getBlockChain=this.getBlockChain.bind(this);
  }

  getBlockChain(){
    axios({
      method: 'get',
      url: 'http://localhost:3001/blocks',
    }).then((res)=>{
       this.setState({
         blockchain: res.data
       })
    });
  }

  componentDidMount(){
    this.getBlockChain();
  }

  render() {

    return (
      <Router>
        <div className="App">
          <NavBar></NavBar>
          <Switch>
            <Route path="/" exact>
              <BlockchainExplorer blockchain={this.state.blockchain}></BlockchainExplorer>
            </Route>
            <Route path="/block/:id" component={Block}/>
            <Route path="/address/:id" component={Address}/>
            <Route path="/transaction/:id" component={Transaction}/>
            <Route path="/access">
              <Login></Login>
            </Route>
            <Route path="/wallet" component={Wallet}/>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
