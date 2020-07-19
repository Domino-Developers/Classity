import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Button from '../../components/Button';
import Auth from '../Auth';
import { authRejected } from '../Auth/authSlice';
import { useQuery } from '../../utils/hooks';

const Navbar = () => {
    let [query, location] = useQuery();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    const hashChange = () => {
        setTimeout(() => {
            const { hash } = window.location;
            if (hash !== '') {
                const element = document.getElementById(hash.slice(1));
                const offset = 100;

                if (element) {
                    window.scrollTo({
                        top: element.getBoundingClientRect().top - offset,
                        behavior: 'smooth'
                    });
                }
            }
        }, 0);
    };

    const authLinks = (
        <Fragment>
            <li className='nav__item'>
                <Link to='/dashboard'>Dashboard</Link>
            </li>
            <li className='nav__item'>
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
            <li className='nav__item'>
                <Link to={`${location.pathname}?authMode=login`}>Log In</Link>
            </li>
            <li className='nav__item nav__item--join'>
                <Button to={`${location.pathname}?authMode=register`} text='Join for Free' full />
            </li>
        </Fragment>
    );

    return (
        <Fragment>
            <nav className='nav'>
                <Link to='/' className='project-name'>
                    Classity
                </Link>
                <ul className='nav__list'>
                    <li className='nav__item'>
                        <Link to='/#explore' onClick={hashChange}>
                            Explore
                        </Link>
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
