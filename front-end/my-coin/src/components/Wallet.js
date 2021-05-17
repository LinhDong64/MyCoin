import { Button } from '@material-ui/core';
import { Component } from 'react'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
const axios = require('axios').default;

class Wallet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            balance: '',
            address: '',
            toAddress: '',
            amount: '',
            transactionPool: []
        }
        this.handleClickMineBlock = this.handleClickMineBlock.bind(this);
        this.getAddress = this.getAddress.bind(this);
        this.getBalance = this.getBalance.bind(this);
        this.handleOnchange = this.handleOnchange.bind(this);
        this.handleCreateTrans = this.handleCreateTrans.bind(this);
        this.getTransactionPool = this.getTransactionPool.bind(this);
    }

    handleClickMineBlock() {
        axios({
            method: 'post',
            url: 'http://localhost:3001/mineBlock'
        }).then((res) => {
            this.getAddress();
            this.getBalance();
        });
    }

    getAddress() {
        axios({
            method: 'get',
            url: 'http://localhost:3001/address'
        }).then((res) => {
            this.setState({
                address: res.data.address
            })
        });
    }

    getBalance() {
        axios({
            method: 'get',
            url: 'http://localhost:3001/balance'
        }).then((res) => {
            this.setState({
                balance: res.data.balance
            })
        });
    }

    getTransactionPool(){
        axios({
            method: 'get',
            url: 'http://localhost:3001/transactionPool'
        }).then((res) => {
            this.setState({
                transactionPool: res.data
            })
        });
    }

    handleCreateTrans() {
        axios({
            method: 'post',
            url: 'http://localhost:3001/sendTransaction',
            data: { 'amount': parseInt(this.state.amount), 'address': this.state.toAddress }
        }).then((res) => {
            console.log(res.data);
            this.setState({
                toAddress: '',
                amount: ''
            })
        });
    }

    handleOnchange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        })
    }

    componentDidMount() {
        this.getAddress();
        this.getBalance();
        this.getTransactionPool();
    }

    render() {
        const transPool = this.state.transactionPool;
        let transPoolEle = null;

        if (transPool.length === 0) {
            transPoolEle = <span>No transactions in transaction pool</span>;
        }
        else {
            transPoolEle = transPool.map((tx, index) => {
                let txInsEle = tx.txIns.map((txIn, index) => {
                    if (txIn.signature === '') {
                        return <span key={index}>coinbase</span>;
                    } else {
                        return <span key={index}>{txIn.txOutId}-{txIn.txOutIndex}</span>
                    }
                })

                let txOutsEle = tx.txOuts.map((txOut, index) => {
                    return <div class="break-word" key={index}>
                        <span>address: {txOut.address}</span>
                    amount: {txOut.amount} </div>
                })

                return (
                    <div key={index}>
                        <Card style={styles.cardStyle}>
                            <CardContent>
                                <Typography color="textSecondary">
                                <span >TxId: { tx.id }</span>
                                </Typography>
                                <br></br>
                        txIns: {txInsEle}
                                <br></br>
                                <br></br>
                        txOuts: {txOutsEle}
                            </CardContent>
                        </Card>
                    </div>

                )
            });


        }

        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-2">
                    </div>
                    <div className="col-sm-8 my-5">
                        <div>
                            Your public address: <h5 style={{ wordWrap: 'break-word' }}>{this.state.address}</h5>
                        </div>
                        <div>
                            Your balance: <h5>{this.state.balance}</h5>
                        </div>
                        <br></br>
                        <hr></hr>

                        <div className="mb-5">
                            <h1>Create Transaction</h1>
                            <p>Transfer some money to someone!</p>
                        </div>
                        <div className="form-group w-100">
                            <label>To address</label>
                            <input type="text" name="toAddress" value={this.state.toAddress} onChange={this.handleOnchange} className="form-control" />
                        </div>
                        <div className="form-group w-100">
                            <label>Amount</label>
                            <input type="text" name="amount" value={this.state.amount} onChange={this.handleOnchange} className="form-control" />
                        </div>
                        <Button variant="contained" color="primary" onClick={this.handleCreateTrans}>Sign & create transaction</Button>
                        <hr></hr>

                        <div>
                            <h5>Transaction pool</h5>
                            {transPoolEle}
                        </div>
                        <hr></hr>

                        <div>
                            <h5>Mine block</h5>
                            <Button variant="contained" color="primary" onClick={this.handleClickMineBlock}>Click to mine Block</Button>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

const styles ={
    cardStyle: {
        border: "1px solid grey"
    },
}

export default Wallet;