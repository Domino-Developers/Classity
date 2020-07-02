import React, { Fragment } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Button from '../../components/Button';
import Auth from '../Auth';
import { authRejected } from '../Auth/authSlice';

import './Navbar.css';

const useQuery = location => new URLSearchParams(location.search);

const Navbar = () => {
    let location = useLocation();
    let query = useQuery(location);
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    const authLinks = (
        <Fragment>
            <li>
                <a href='#!'>Dashboard</a>
            </li>
            <li>
                <a
                    href='#!'
                    onClick={() => {
                        dispatch(authRejected());
                    }}
                >
                    Logout
                </a>
            </li>
        </Fragment>
    );

    const guestLinks = (
        <Fragment>
            <li>
                <Link to={`${location.pathname}?authMode=login`}>Log In</Link>
            </li>
            <li className='bg-primary'>
                <Button
                    to={`${location.pathname}?authMode=register`}
                    text='Join for Free'
                    full
                />
            </li>
        </Fragment>
    );

    return (
        <Fragment>
            <nav className='navbar bg-dark'>
                <h1>
                    <Link to={'/'}>Study Tube</Link>
                </h1>
                <ul>
                    <li>
                        <a href='#!'>Explore</a>
                    </li>
                    {isAuthenticated ? authLinks : guestLinks}
                </ul>
            </nav>
            {query.get('authMode') && (
                <Auth mode={query.get('authMode')} path={location.pathname} />
            )}
        </Fragment>
    );
};

export default Navbar;
