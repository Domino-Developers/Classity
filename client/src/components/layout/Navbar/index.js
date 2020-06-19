import React, { useState, Fragment } from 'react';
import Button from '../Button';
import Register from '../../auth/Register';

import './Navbar.css';

const Navbar = () => {
    const [visible, setVisible] = useState(false);
    return (
        <Fragment>
            <nav className='navbar bg-dark'>
                <h1> Study Tube </h1>
                <ul>
                    <li>
                        <a href='#!'>Explore</a>
                    </li>
                    <li>
                        <a href='#!'>Log In</a>
                    </li>
                    <li
                        className='bg-primary'
                        onClick={() => {
                            setVisible(true);
                        }}
                    >
                        <Button text='Join for Free' full />
                    </li>
                </ul>
            </nav>
            {visible ? (
                <Register
                    hide={() => {
                        setVisible(false);
                    }}
                />
            ) : null}
        </Fragment>
    );
};

export default Navbar;
