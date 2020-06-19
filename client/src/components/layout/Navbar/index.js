import React from 'react';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className='navbar bg-dark'>
            <h1> Study Tube </h1>
            <ul>
                <li>Explore!</li>
                <li>Log in</li>
                <li className='bg-primary'>Join for free</li>
            </ul>
        </nav>
    );
};

export default Navbar;
