import { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import NavBar from './components/NavBar'
import BlockchainViewer from './components/pages/BlockchainViewer'
import { Blockchain } from './blockchain'
import Setting from './components/pages/Setting'
import CreateTransaction from './components/pages/CreateTransaction'
import Login from './components/pages/WalletActions'

const EC = require('elliptic').ec

class App extends Component {
  blockchainInstance = new Blockchain();
  walletKeys = [];

  constructor(props) {
    super(props);
    this.blockchainInstance.difficulty = 1;
    this.blockchainInstance.minePendingTransactions('my-wallet-address');
    this.generateWalletKeys();

    this.getBlocks = this.getBlocks.bind(this);
  }

  getBlocks() {
    return this.blockchainInstance.chain;
  }

  generateWalletKeys() {
    const ec = new EC('secp256k1');
    const key = ec.genKeyPair();

    this.walletKeys.push({
      keyObj: key,
      publicKey: key.getPublic('hex'),
      privateKey: key.getPrivate('hex')
    });
  }

  componentDidMount(){
    this.setState({
      publicKey: this.walletKeys.publicKey
    })
  }

  render() {
    return (
      <Router>
        <div className="App">
          <NavBar></NavBar>
          <Switch>
            <Route path="/" exact>
              {/* <BlockchainViewer blocks={this.getBlocks()}></BlockchainViewer> */}
            <Login></Login>
            </Route>
            <Route path="/setting">
              <Setting></Setting>
            </Route>
            <Route path="/create-transaction">
              <CreateTransaction fromAddress={this.walletKeys[0].publicKey}></CreateTransaction>
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
