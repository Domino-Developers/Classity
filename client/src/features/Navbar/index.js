import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';

import Button from '../../components/Button';
import Battery from '../../components/Battery';
import Auth from '../Auth';
import { authRejected } from '../Auth/authSlice';
import { useQuery } from '../../utils/hooks';

const sel = createSelector(
    [
        state => state.auth.isAuthenticated,
        state => state.user.name,
        state => state.user.email,
        state => state.user.energy
    ],
    (isAuthenticated, name, email, energy) => ({ isAuthenticated, name, email, energy })
);

const Navbar = () => {
    let [query, location] = useQuery();
    const dispatch = useDispatch();
    const { isAuthenticated, name, email, energy } = useSelector(sel);

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

    const authLinks = isAuthenticated && (
        <Fragment>
            <li>
                <Link className='nav__link' to='/dashboard'>
                    My Courses
                </Link>
            </li>
            <li className='nav__auth-list-container'>
                <span className='nav__item nav__link'>{name}</span>

                <ul className='nav__auth-list'>
                    <li className='nav__item nav__item--border'>
                        <p className='nav__user--name'>{name}</p>
                        <p className='nav__user--email'>{email}</p>
                    </li>
                    <li className='nav__item nav__item--border'>
                        <Link to='/help#energy'>
                            <Battery power={energy} />
                        </Link>
                    </li>
                    <li>
                        <Link className='nav__link' to='/profile'>
                            Profile
                        </Link>
                    </li>
                    <li className='nav__item--border'>
                        <Link className='nav__link' to='/dashboard'>
                            My Courses
                        </Link>
                    </li>
                    <li>
                        <Link className='nav__link' to='/help'>
                            Help
                        </Link>
                    </li>
                    <li>
                        <a
                            className='nav__link'
                            href='#!'
                            onClick={() => {
                                dispatch(authRejected());
                            }}>
                            Logout
                        </a>
                    </li>
                </ul>
            </li>
        </Fragment>
    );

    const guestLinks = !isAuthenticated && (
        <Fragment>
            <li>
                <Link className='nav__link' to={`${location.pathname}?authMode=login`}>
                    Log In
                </Link>
            </li>
            <li className='nav__item'>
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
                    <li>
                        <Link className='nav__link' to='/#explore' onClick={hashChange}>
                            Explore
                        </Link>
                    </li>
                    {authLinks}
                    {guestLinks}
                </ul>
            </nav>
            {query.get('authMode') && (
                <Auth mode={query.get('authMode')} path={location.pathname} />
            )}
        </Fragment>
    );
};

export default Navbar;
