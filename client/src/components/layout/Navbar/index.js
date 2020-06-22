import React, { Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import Button from '../Button';
import Auth from '../../Auth';

import './Navbar.css';

const useQuery = location => new URLSearchParams(location.search);

const Navbar = () => {
    let location = useLocation();
    let query = useQuery(location);

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
                    <li className='bg-primary'>
                        <Button
                            to={`${location.pathname}?authMode=register`}
                            text='Join for Free'
                            full
                        />
                    </li>
                </ul>
            </nav>
            {query.get('authMode') && (
                <Auth mode={query.get('authMode')} path={location.pathname} />
            )}
        </Fragment>
    );
};

export default Navbar;
