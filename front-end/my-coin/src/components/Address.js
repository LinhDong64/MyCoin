import { Component } from 'react'
import lodash from 'lodash';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom'
const axios = require('axios').default;

class Address extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addressData: {}
        }
        this.getAddress = this.getAddress.bind(this);
        this.totalAmount = this.totalAmount.bind(this);
        this.trimAddress = this.trimAddress.bind(this);
    }

    getAddress() {
        const address = this.props.match.params.id;
        axios({
            method: 'get',
            url: `http://localhost:3001/address/${address}`
        }).then((res) => {
            console.log(res.data);
            this.setState({
                addressData: res.data
            })
        });
    }

    totalAmount(unspentOutputs) {
        return lodash(unspentOutputs)
            .map(uTxo => uTxo.amount)
            .sum();
    }

    trimAddress(address) {
        return address.substr(0, 24) + '...';
    }

    componentDidMount() {
        this.getAddress();
    }

    render() {
        let { unspentTxOuts } = this.state.addressData;
        let uTxOutsEle = null;

        if (unspentTxOuts !=null) {
            uTxOutsEle = unspentTxOuts.map((uTxo, index) => {
                return <div key={index} style={{marginBottom: "25px"}}>
                    <Card>
                        <CardContent>
                            <div>
                                <span>txOutId:</span>
                                <Link to={{ pathname: `/transaction/${uTxo.txOutId}` }}>{uTxo.txOutId}</Link>
                            </div>
                            <div>txOutIndex: {uTxo.txOutIndex}</div>
                            <div >amount: {uTxo.amount}</div>
                            <div style={{wordWrap:"break-word"}}>address: {uTxo.address}</div>
                        </CardContent>
                    </Card>
                </div>
            })

        }

        return (
            <div style={styles.container}>
                <div>
                    <h3>Address: </h3>
                    <h4 style={{ wordWrap: "break-word" }}>{this.props.match.params.id}</h4>
                    <h4>Total amount: {this.totalAmount(this.state.addressData.unspentTxOuts)} </h4>
                </div>
                <br></br>
                <div>
                    <h4>Unspent transaction outputs</h4>
                    {uTxOutsEle}
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


export default Address;