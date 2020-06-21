import React, { Fragment } from 'react';
import { useLocation, Link } from 'react-router-dom';

// components
import Button from '../Button';
import Auth from '../../auth/Auth';

import './Navbar.css';

// custom hook for query param
function useQuery(location) {
    return new URLSearchParams(location.search);
}

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
                        <Link to={`${location.pathname}?authMode=register`}>
                            <Button text='Join for Free' full />
                        </Link>
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
