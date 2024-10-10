// src/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../Navbar.css'; 


const Navbar = () => {
    return (
        <nav className="navbar">
            <ul className="navbar-links">
                <li><Link to="/dashboard">Home</Link></li>
                <li><Link to="/analytics">Analytics</Link></li>
                <li><Link to="/categories">Categories</Link></li>
                <li><Link to="/profile">User Profile</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;
