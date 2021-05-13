import { Component } from 'react'

class TransactionTable extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {
        let data = this.props.data;
        let eleItems = null;

        if(data.length > 0){
            eleItems = data.map((item, index) => {
                return (<tr>
                    <th scope="row">{item.index}</th>
                    <td>{item.fromAddress}</td>
                    <td>{item.toAddress}</td>
                    <td>{item.amount}</td>
                    <td>{item.timestamp}</td>
                    <td></td>
                </tr>)
            })
        }else{
            
        }

        return (
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">From</th>
                        <th scope="col">To</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Timestamp</th>
                        <th scope="col">Valid</th>
                    </tr>
                </thead>
                <tbody>
                    {eleItems}
                </tbody>
            </table>
        )
    }
}

export default TransactionTable;