import { Component } from 'react'
import BlockView from '../BlockView'
import TransactionTable from '../TransactionTable'

class BlockchainViewer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedBlock: -1,
        }
        this.showTransTable = this.showTransTable.bind(this);
    }

    showTransTable(index){
        console.log(index);
        this.setState({
            selectedBlock: index,
        })

        //console.log(this.state);
    }

    render() {
        let blocks = this.props.blocks;
        let transTable = null;

        let blockCards = blocks.map((item, index)=>{
            return <BlockView onClickBlock={()=>this.showTransTable(index)} key={index} index = {index} block = {item}></BlockView>
        });

        if(this.state.selectedBlock >= 0){
            transTable = <TransactionTable data={blocks[this.state.selectedBlock]}></TransactionTable>
        }

        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-12 my-5">
                        <div>
                            <h1>Blocks on chain</h1>
                            <p>Each card represents a block on the chain. Click on a block to see the transactions stored inside.</p>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 d-flex">
                        {blockCards}
                    </div>
                </div>
                <div className="row my-5">
                    {transTable}
                </div>
            </div>
        )
    }
}

export default BlockchainViewer;