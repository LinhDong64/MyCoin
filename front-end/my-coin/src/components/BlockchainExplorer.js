import { Component } from 'react'
import {Link} from 'react-router-dom'

const lodash = require('lodash');

class BlockchainExplorer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const data = this.props.blockchain;
        const sortedData = lodash(data).sortBy('index').reverse().value();
        let dataRows = null;

        if (sortedData.length > 0) {
            dataRows = sortedData.map((block) => {
                return (
                    <tr key={block.index}>
                        <td>{block.index}</td>
                        <td><Link to={{ pathname: `block/${block.hash}` }}>{block.hash}</Link></td>
                        <td>{block.data.length}</td>
                        <td>{block.timestamp}</td>
                    </tr>
                )
            })
        }

        return (
            <div className="d-flex justify-content-center mt-5">
                <table className="table" style={styles.table}>
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">hash</th>
                            <th scope="col">Transaction</th>
                            <th scope="col">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataRows}
                    </tbody>
                </table>
            </div>
        )
    }
}

const styles = {
    table: {
        width: "80%"
    }
}

export default BlockchainExplorer;