import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './style.css';

// components
import Register from './Register';
import Login from './Login';

const Auth = props => {
    return (
        <Fragment>
            <div className='overlay'></div>
            <Link to={props.path} className='overlay-close'>
                <i className='fas fa-times'></i>
            </Link>
            <div className='overlay-container'>
                <div className='auth-container'>
                    <div className='auth-header'>
                        <h1>StudyTube</h1>
                        <ul className='auth-nav'>
                            {/* I want lis in this to be white */}
                            <li>
                                <Link to={`${props.path}?authMode=register`}>
                                    Sign Up
                                </Link>
                            </li>
                            <li>
                                <Link to={`${props.path}?authMode=login`}>
                                    Log in
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className='auth-card'>
                        {props.mode === 'login' ? <Login /> : <Register />}
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
