import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import Register from './Register';
import Login from './Login';

import './Auth.css';

const Auth = props => {
    const { path, mode } = props;
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    return (
        <Fragment>
            <div className='overlay'></div>
            <Link to={path} className='overlay-close'>
                <i className='fas fa-times'></i>
            </Link>
            <div className='overlay-container'>
                <div className='auth-container'>
                    <div className='auth-header'>
                        <h1>StudyTube</h1>
                        <ul className='auth-nav'>
                            <li>
                                <Link
                                    className={
                                        mode === 'register' ? 'active' : ''
                                    }
                                    to={`${path}?authMode=register`}
                                >
                                    Sign Up
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className={mode === 'login' ? 'active' : ''}
                                    to={`${path}?authMode=login`}
                                >
                                    Log in
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className='auth-card'>
                        {mode === 'login' ? <Login /> : <Register />}
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
