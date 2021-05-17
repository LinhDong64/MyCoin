import { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom'
const axios = require('axios').default;


class Login extends Component {
    constructor(props){
        super(props);
        this.state={
            value: '',
        }
        this.handleOnChange=this.handleOnChange.bind(this);
    }

    handleOnChange(e){
        this.setState({
            value: e.target.value
        })
    }

    render() {
        return (
            <div style={styles.cardContainer}>
                <Card style={styles.card}>
                    <CardContent style={styles.cardContent}>
                        <h3 style={styles.cardTitle}>Access My Wallet</h3>
                        <input value={this.state.value} onChange={this.handleOnChange} style={styles.inputBox} placeholder="Enter your key" type="password">
                        </input>
                    </CardContent>
                    <CardActions style={styles.cardAction}>
                        <Link to="/wallet"> Access Wallet </Link>
                        <Button variant="outlined" color="primary" download href='http://localhost:3001/key'>
                            Create Wallet
                        </Button>
                    </CardActions>
                </Card>
            </div>
        )
    }
}

const styles = {
    cardContainer: {
        display: 'flex',
        justifyContent: "center",
        paddingTop: '10rem'
    },

    card: {
        width: '35rem',
        border: '1px solid grey'
    },

    cardContent: {
        textAlign: "center"
    },

    cardTitle: {
        marginBottom: '2rem'
    },

    cardAction: {
        justifyContent: "flex-end",
        padding: 16
    },

    inputBox: {
        width: '100%',
        border: '1px solid grey',
        outline: 'none',
        padding: '5px 10px'
    }
}

export default Login;