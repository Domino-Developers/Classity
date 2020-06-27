import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './Button.css';

const Button = props => {
    const { full, text, onClick, to } = props;
    return (
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
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    to: PropTypes.string
};

export default Button;
