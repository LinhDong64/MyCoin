import { Component } from 'react';

class BlockView extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
        this.handleClickBlock=this.handleClickBlock.bind(this);
    }

    handleClickBlock(){
        this.props.onClickBlock();
    }

    render() {
        let block = this.props.block;

        return (
            <div className="col-sm-4" onClick={this.handleClickBlock}>
                <div className="card m-2">
                    <div className="card-body">
                        <h3 className="card-title text-start">Block</h3>
                    </div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                            <span className="block-title">Hash</span>
                            <div className="block-content">
                                <small>{block.hash}</small>
                            </div>
                        </li>
                        <li className="list-group-item">
                            <span className="block-title">Hash of previous block</span>
                            <div className="block-content">
                                <small>{block.previousHash}</small>
                            </div>
                        </li>
                        <li className="list-group-item">
                            <span className="block-title">Nonce</span>
                            <div className="block-content">
                                <small>{block.nonce}</small>
                            </div>
                        </li>
                        <li className="list-group-item">
                            <span className="block-title">Timestamp</span>
                            <div className="block-content">
                                <small>{block.timestamp}</small>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default BlockView;