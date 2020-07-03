import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './Button.css';

const Button = props => {
    const { full, text, onClick, to, loading, value } = props;
    return loading ? (
        <div className='btn btn-disabled'>
            <div className='show'>
                <span className='text'>{loading}</span>
                <span className='dots'>&nbsp;. . .</span>
            </div>
            <span className='hide'>{text || value}</span>
        </div>
    ) : value ? (
        <input type='submit' value={value} className='btn btn-full' />
    ) : (
        <Link
            className={full ? 'btn btn-full' : 'btn btn-ghost'}
            onClick={onClick}
            to={to || '#!'}
        >
            {text}
        </Link>
    );
};

Button.propTypes = {
    full: PropTypes.bool,
    text: PropTypes.string,
    onClick: PropTypes.func,
    to: PropTypes.string,
    value: PropTypes.string,
    loading: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
};

export default Button;
