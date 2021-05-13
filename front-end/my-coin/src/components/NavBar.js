import { Component } from 'react'
import {
    BrowserRouter as Router,
    Link
} from "react-router-dom";
const Swal = require('sweetalert2')

class NavBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router>
                <header className="header-area">
                    <div className="main-menu">
                        <nav className="navbar navbar-expand-lg nav-dark bg-dark shadow">
                            <div className="collapse navbar-collapse" id="navbarNav">
                                <div className="mr-auto" />
                                <ul className="navbar-nav">
                                    <li className="nav-item">
                                        <a href='/' className="btn btn-outline-primary">Home</a>
                                    </li>
                                    <li className="nav-item">
                                        <a href='/setting' className="btn btn-outline-primary">Setting</a>
                                    </li>
                                    <li className="nav-item">
                                        <a href='/create-transaction' className="btn btn-outline-primary">Create transaction</a>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </div>
                </header>
            </Router>
        )
    }
}

export default NavBar;