import { Component } from 'react'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom'
const axios = require('axios').default;

class Block extends Component {
    constructor(props) {
        super(props);
        this.state = {
            block: {}
        }
    }

    componentDidMount() {
        const url = 'http://localhost:3001/block/' + this.props.match.params.id;
        axios({
            method: 'get',
            url: url
        }).then((res) => {
            console.log(res.data);
            this.setState({
                block: res.data
            })
        });
    }

    render() {
        let blockEle = null;
        let transEle = null;
        let block = this.state.block;
        if (block.hash) {
            blockEle = <div>
                <h3>Block #{block.index}</h3>
                <table>
                    <tbody>
                        <tr style={styles.tr_style}>
                            <td>Hash</td>
                            <td>{block.hash}</td>
                        </tr>
                        <tr style={styles.tr_style}>
                            <td>Previous hash</td>
                            <td>{block.previousHash}</td>
                        </tr>
                        <tr style={styles.tr_style}>
                            <td>Timestamp</td>
                            <td>{block.timestamp}</td>
                        </tr>
                        <tr style={styles.tr_style}>
                            <td>Difficulty</td>
                            <td>{block.difficulty}</td>
                        </tr>
                        <tr style={styles.tr_style}>
                            <td>Nonce</td>
                            <td>{block.nonce}</td>
                        </tr>
                        <tr style={styles.tr_style}>
                            <td>Number of transactions</td>
                            <td>{block.data.length}</td>
                        </tr>

                    </tbody>
                </table>
            </div>

            transEle = block.data.map((tx, index) => {
                let txInsEle = null;
                let txOutsEle = null;

                txInsEle = tx.txIns.map((txIn, index) => {
                    if (txIn.signature === '') {
                        return <span key={index}>coinbase</span>;
                    } else {
                        return <span key={index}>{txIn.txOutId}-{txIn.txOutIndex}</span>
                    }
                });

                txOutsEle = tx.txOuts.map((txOut, index) => {
                    return <div key={index}>
                        <Typography>
                            <Link to={{ pathname: `/address/${txOut.address}` }} style={styles.wrapText}>{txOut.address}</Link>
                        </Typography>
                        <Typography>
                            <span>amount: {txOut.amount}</span>
                        </Typography>
                    </div>
                });

                return <div style={styles.cardContainer} key={index}>
                    <h3>Transaction</h3>
                    <Card style={styles.cardStyle}>
                        <CardContent>
                            <Typography color="textSecondary">
                                Id: <Link to={{ pathname: `/transaction/${tx.id}` }}>{tx.id}</Link>
                            </Typography>
                            <br></br>
                            txIns: {txInsEle}
                            <br></br>
                            <br></br>
                            txOuts: {txOutsEle}
                        </CardContent>
                    </Card>
                </div>
            })
        }

        return (
            <div style={styles.container}>
                {blockEle}
                {transEle}
            </div>
        )
    }
}

const styles = {
    container: {
        display: 'flex',
        alignItems: "start",
        padding: '100px',
        flexDirection: "column"
    },

    tr_style: {
        borderBottom: "1px solid #E1E1E1",
        margin: "30px 5px"
    },

    cardContainer: {
        width: "100%",
        marginTop: "20px",
    },

    cardStyle: {
        border: "1px solid grey"
    },

    wrapText: {
        wordWrap: "break-word"
    }
}

export default Block;