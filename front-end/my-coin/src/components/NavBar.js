import { Component } from 'react'
import { Link } from "react-router-dom";
const Swal = require('sweetalert2')

class NavBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <header className="header-area">
                <div className="main-menu">
                    <nav className="navbar navbar-expand-lg nav-dark bg-dark shadow">
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <div className="mr-auto" />
                            <ul className="navbar-nav">
                                <li className="nav-item" style={styles.navItem}>
                                    <Link to='/' className="btn btn-outline-primary">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to='/create-transaction' className="btn btn-outline-primary">Create transaction</Link>
                                </li>
                                <li>
                                    <Link to="/login" className="btn btn-outline-primary">Access Wallet</Link>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </header>
        )
    }
}

const styles = {
    navItem:{
        marginRight: '5px'
    }
}

export default NavBar;