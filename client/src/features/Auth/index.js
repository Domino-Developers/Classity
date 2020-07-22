import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import Register from './Register';
import Login from './Login';
import { createSelector } from '@reduxjs/toolkit';

const sel = createSelector(
    [state => state.auth.isAuthenticated, state => state.auth.inactive],
    (isAuthenticated, inactive) => ({ isAuthenticated, inactive })
);

const Auth = props => {
    const { path, mode } = props;
    const { isAuthenticated, inactive } = useSelector(sel);

    return (
        <Fragment>
            <div className='overlay'>
                <Link to={path} className='overlay__close'>
                    <i className='fas fa-times overlay__clos'></i>
                </Link>
                <div className='overlay__container'>
                    <div className='auth'>
                        <span className='project-name auth__heading'>Classity</span>
                        <ul className='auth__nav'>
                            <li>
                                <Link
                                    className={
                                        mode === 'register' ? 'auth__link active' : 'auth__link'
                                    }
                                    to={`${path}?authMode=register`}>
                                    Sign Up
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className={
                                        mode === 'login' ? 'auth__link active' : 'auth__link'
                                    }
                                    to={`${path}?authMode=login`}>
                                    Log in
                                </Link>
                            </li>
                        </ul>
                        <div className='auth__card'>
                            {mode === 'login' ? <Login /> : <Register />}
                            {inactive &&
                                (mode === 'login'
                                    ? 'Please verify your email before logging in'
                                    : 'Please check your email for verification. Make sure to check your spam and junk mail to! It may take upto 15 mins')}
                        </div>
                    </div>
                </div>
            </div>
            {isAuthenticated && <Redirect to={path} />}
        </Fragment>
    );
};

Auth.propTypes = {
    mode: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired
};

export default Auth;
