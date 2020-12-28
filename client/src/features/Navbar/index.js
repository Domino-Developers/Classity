import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';

import Button from '../../components/Button';
import SearchBar from '../SearchBar';
import Battery from '../../components/Battery';
import Auth from '../Auth';
import { authRejected } from '../Auth/authSlice';
import { useQuery } from '../../utils/hooks';

const sel = createSelector(
    [
        state => state.auth.isAuthenticated,
        state => state.user._id,
        state => state.user.name,
        state => state.user.email,
        state => state.user.energy,
        state => state.user.loading
    ],
    (isAuthenticated, userId, name, email, energy, loading) => ({
        isAuthenticated,
        userId,
        name,
        email,
        energy,
        loading
    })
);

const Navbar = () => {
    const smallScreenQuery = window.matchMedia('(max-width: 43.75em)');
    const [isSmallScreen, setIsSmallScreen] = useState(smallScreenQuery.matches);
    useEffect(() => {
        smallScreenQuery.addListener(() => setIsSmallScreen(smallScreenQuery.matches));

        return () =>
            smallScreenQuery.removeListener(() => setIsSmallScreen(smallScreenQuery.matches));
    });

    let [query, location] = useQuery();
    const dispatch = useDispatch();
    const { isAuthenticated, userId, name, email, energy, loading } = useSelector(sel);
    const [collapsed, setCollapsed] = useState(true);

    const colors = ['#9c32ff', '#e000e0', '#1447f0', '#1fbe27', '#02b3b3', '#7961ff'];
    const rndInd = Math.floor(Math.random() * 6);
    const bgColor = localStorage.getItem('GTS_USER_BG') || colors[rndInd];
    localStorage.setItem('GTS_USER_BG', bgColor);

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

    const authLinks = isAuthenticated && !loading && (
        <Fragment>
            {isSmallScreen && (
                <Fragment>
                    <li className='nav__item'>
                        <div className='nav__user--img-name-container'>
                            <Link
                                to={`/profile/${userId}`}
                                className='nav__user--img'
                                style={{ backgroundColor: bgColor }}>
                                {name.toUpperCase()[0]}
                            </Link>
                            <p className='nav__user--name'>{name}</p>
                        </div>
                        <p className='nav__user--email'>{email}</p>
                    </li>
                    <li>
                        <Link to='/help#energy' className='nav__link'>
                            <Battery power={energy} />
                        </Link>
                    </li>
                </Fragment>
            )}
            <li>
                <Link className='nav__link nav__link--main' to='/#explore' onClick={hashChange}>
                    Explore
                </Link>
            </li>
            {!isSmallScreen && (
                <li>
                    <Link className='nav__link nav__link--main' to='/dashboard'>
                        My Courses
                    </Link>
                </li>
            )}
            <li className='nav__auth-list-container'>
                {!isSmallScreen && (
                    <Link
                        to={`/profile/${userId}`}
                        className='nav__user--img'
                        style={{ backgroundColor: bgColor }}>
                        {name.toUpperCase()[0]}
                    </Link>
                )}

                <ul className='nav__auth-list'>
                    {!isSmallScreen && (
                        <Fragment>
                            <li className='nav__item nav__item--border'>
                                <p className='nav__user--name'>{name}</p>
                                <p className='nav__user--email'>{email}</p>
                            </li>
                            <li className='nav__item nav__item--border'>
                                <Link to='/help#energy'>
                                    <Battery power={energy} />
                                </Link>
                            </li>
                        </Fragment>
                    )}
                    <li>
                        <Link className='nav__link' to={`/profile/${userId}`}>
                            My Profile
                        </Link>
                    </li>
                    <li>
                        <Link className='nav__link' to='/dashboard'>
                            My Courses
                        </Link>
                    </li>
                    <li className='nav__item--border'>
                        <Link className='nav__link' to='/leaderboard'>
                            Leaderboard
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

    const guestLinks = (!isAuthenticated || loading) && (
        <Fragment>
            <li>
                <Link className='nav__link nav__link--main' to='/#explore' onClick={hashChange}>
                    Explore
                </Link>
            </li>
            <li>
                <Link className='nav__link nav__link--main' to='/leaderboard'>
                    Leaderboard
                </Link>
            </li>
            <li>
                <Link
                    className='nav__link nav__link--main'
                    to={`${location.pathname}?authMode=login`}>
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
            <nav className={'nav' + (collapsed && isSmallScreen ? ' nav--collapsed' : '')}>
                {isSmallScreen && (
                    <div className='nav__overlay' onClick={() => setCollapsed(true)} />
                )}
                {isSmallScreen && (
                    <a className='nav__toggle' onClick={() => setCollapsed(!collapsed)}>
                        &#9776;
                    </a>
                )}
                <Link to='/'>
                    <img src={require('../../img/Logo.png')} className='nav__logo' />
                </Link>
                <SearchBar small />
                <ul className='nav__list' onClick={() => setCollapsed(true)}>
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
