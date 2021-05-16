import {Component} from 'react'
const axios = require('axios').default;

class Block extends Component{
    constructor(props){
        super(props);
        this.state={
            block: {}
        }
    }

    componentDidMount(){
        const url = 'http://localhost:3001/block/'+ this.props.match.params.id;
        axios({
            method: 'get',
            url: url
          }).then((res)=>{
            console.log(res.data);
             this.setState({
               block: res.data
             })
          });
    }

    render(){
        console.log(this.props.match.params.id);
        return(
            <div>BLock</div>
        )
    }
}

export default Block;