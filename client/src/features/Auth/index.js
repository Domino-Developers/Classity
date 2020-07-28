import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import Register from './Register';
import Login from './Login';
import { createSelector } from '@reduxjs/toolkit';

const sel = createSelector(
    state => state.auth.isAuthenticated,
    isAuthenticated => isAuthenticated
);

const Auth = props => {
    const { path, mode } = props;
    const isAuthenticated = useSelector(sel);

    return (
        <Fragment>
            <div className='overlay'>
                <Link to={path} className='overlay__close'>
                    <i className='fas fa-times'></i>
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
                            <div className='google-btn'>
                                <a href='http://localhost:5000/auth/google'>
                                    <i class='fab fa-google'></i> Continue with Google
                                </a>
                            </div>
                            {mode === 'login' ? <Login /> : <Register />}
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
