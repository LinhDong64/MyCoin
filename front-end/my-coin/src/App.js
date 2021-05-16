import { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import CreateTransaction from './components/pages/CreateTransaction'
import Login from './components/pages/WalletActions'
import BlockchainExplorer from './components/BlockchainExplorer'
import NavBar from './components/NavBar';
import Block from './components/Block'

const axios = require('axios').default;

// const EC = require('elliptic').ec

class App extends Component {

  constructor(props) {
    super(props);

    this.state={
      blockchain: []
    }
  }

  componentDidMount(){
    axios({
      method: 'get',
      url: 'http://localhost:3001/blocks',
    }).then((res)=>{
       this.setState({
         blockchain: res.data
       })
    });
  }

  render() {
    const pageTitle = <h3>LinDo Blockchain Explorer</h3>;
    return (
      <Router>
        <div className="App">
          <NavBar></NavBar>
          {pageTitle}
          <Switch>
            <Route path="/" exact>
              <BlockchainExplorer blockchain={this.state.blockchain}></BlockchainExplorer>
            </Route>
            <Route path="/block/:id" component={Block}>
              {/* <Block></Block> */}
            </Route>
            <Route path="/create-transaction">
              <CreateTransaction></CreateTransaction>
            </Route>
            <Route path="/login">
              <Login></Login>
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
