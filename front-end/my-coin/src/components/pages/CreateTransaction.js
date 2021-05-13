import { Component } from 'react'

class CreateTransaction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toAddress: '',
            amount: ''
        }

        this.handleOnchange = this.handleOnchange.bind(this);
        this.handleCreateTrans = this.handleCreateTrans.bind(this);
    }

    handleCreateTrans() {
        console.log(this.state);
    }

    handleOnchange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        })
    }

    render() {
        console.log(this.props.fromAddress);
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-2">
                    </div>
                    <div className="col-sm-8 my-5">
                        <div className="mb-5">
                            <h1>Create Transaction</h1>
                            <p>Transfer some money to someone!</p>
                        </div>
                        <div className="form-group w-100">
                            <label>From address</label>
                            <input type="text" name="fromAddress" value={this.props.fromAddress} className="form-control" readOnly />
                        </div>
                        <div className="form-group w-100">
                            <label>To address</label>
                            <input type="text" name="toAddress" value={this.state.toAddress} onChange={this.handleOnchange} className="form-control" />
                        </div>
                        <div className="form-group w-100">
                            <label>Amount</label>
                            <input type="text" name="amount" value={this.state.amount} onChange={this.handleOnchange} className="form-control" />
                        </div>
                        <button type="button" onClick={this.handleCreateTrans} className="btn btn-primary">Sign & create transaction</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default CreateTransaction;