import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Button from '../../components/Button';
import Auth from '../Auth';
import { authRejected } from '../Auth/authSlice';
import { useQuery } from '../../utils/hooks';

import './Navbar.css';

const Navbar = () => {
    let [query, location] = useQuery();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    const authLinks = (
        <Fragment>
            <li>
                <Link to='/dashboard'>Dashboard</Link>
            </li>
            <li>
                <a
                    href='#!'
                    onClick={() => {
                        dispatch(authRejected());
                    }}>
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
                <Button to={`${location.pathname}?authMode=register`} text='Join for Free' full />
            </li>
        </Fragment>
    );

    return (
        <Fragment>
            <nav className='navbar'>
                <Link to={'/'} className='project-name'>
                    Classity
                </Link>
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
