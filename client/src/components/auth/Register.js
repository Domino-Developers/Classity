import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import './style.css';

const Register = props => {
    return (
        <Fragment>
            <div className='overlay'></div>
            <span className='overlay-close' onClick={props.hide}>
                <i className='fas fa-times'></i>
            </span>
            <div className='overlay-container'>
                <div className='auth-container'>
                    <header className='auth-header'>StudyTube</header>
                    <div className='auth-card'>fasf</div>
                </div>
            </div>
        </Fragment>
    );
};

Register.propTypes = {
    hide: PropTypes.func.isRequired
};

export default Register;
