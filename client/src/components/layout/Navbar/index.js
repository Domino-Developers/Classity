import React from 'react';
import Button from '../Button';

import './Navbar.css';

const Navbar = () => (
    <nav className='navbar bg-dark'>
        <h1> Study Tube </h1>
        <ul>
            <li>
                <a href='#!'>Explore</a>
            </li>
            <li>
                <a href='#!'>Log In</a>
            </li>
            <li className='bg-primary'>
                <Button text='Join for Free' full />
            </li>
        </ul>
    </nav>
);

export default Navbar;
