import { Component } from 'react'
import lodash from 'lodash';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom'
const axios = require('axios').default;

class Transaction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transaction: {}
        }
        this.getTransaction = this.getTransaction.bind(this);
        this.totalValue = this.totalValue.bind(this);
        this.trimAddress = this.trimAddress.bind(this);
    }

    getTransaction() {
        const id = this.props.match.params.id;
        axios({
            method: 'get',
            url: `http://localhost:3001/transaction/${id}`
        }).then((res) => {
            this.setState({
                transaction: res.data
            })
        });
    }

    trimAddress(address) {
        return address.substr(0, 24) + '...';
    }

    totalValue(transaction) {
        return lodash(transaction.txOuts)
            .map(txOut => txOut.amount)
            .sum()
    }

    componentDidMount() {
        this.getTransaction();
    }

    render() {
        const { transaction } = this.state;
        const txIns = transaction.txIns;
        const txOuts = transaction.txOuts;

        let txInsEle = null;
        if (txIns) {
            txInsEle = txIns.map((txIn, index) => {
                let title = '';
                if (txIn.signature === '') {
                    title = <h5 key={index}>Coinbase transaction</h5>;
                }

                return <div key={index} style={{ marginBottom: "25px" }}>
                    <Card>
                        <CardContent>
                            <div>{title}</div>
                            <div>
                                <span>TxOutId:</span>
                                <Link to={{ pathname: `/transaction/${txIn.txOutId}` }}>{txIn.txOutId}</Link>
                            </div>
                            <div >TxOutIndex:  {txIn.txOutIndex}</div>
                            <div >Signature: {txIn.signature}</div>
                        </CardContent>
                    </Card>
                </div>
            })
        }

        let txOutsEle = null;
        if (txOuts) {
            txOutsEle = txOuts.map((txOut, index) => {
                return <div key={index}>
                    <Card>
                        <CardContent>
                            <div>
                                <span>Address:</span>
                                <Link to={{ pathname: `/address/${txOut.address}` }}>{txOut.address}</Link>
                            </div>
                            <div>Amount: {txOut.amount}</div>
                        </CardContent>
                    </Card>
                </div>
            })
        }

        return (
            <div style={styles.container}>
                <div>
                    <h3>Transaction</h3>
                    <h4>{this.state.transaction.id}</h4>
                    <h4>Total amount: {this.totalValue(this.state.transaction)}</h4>
                </div>
                <div>
                    <h5>TxIns</h5>
                    {txInsEle}
                </div>
                <div>
                    <h5>TxOuts</h5>
                    {txOutsEle}
                </div>
            </div>
        )
    }
}

const styles = {
    container: {
        margin: "50px 150px",

    }
}

export default Transaction;