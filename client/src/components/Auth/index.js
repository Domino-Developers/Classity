import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Register from './Register';
import Login from './Login';

import './Auth.css';

const Auth = props => {
    const { path, mode } = props;

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
        </Fragment>
    );
};

Auth.propTypes = {
    mode: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired
};

export default Auth;
