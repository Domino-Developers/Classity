import React from 'react';
import PropTypes from 'prop-types';

import './Button.css';

const Button = props => {
    const { full, text, onClick } = props;
    return (
        <a
            href='#!'
            className={full ? 'btn btn-full' : 'btn btn-ghost'}
            onClick={onClick}
        >
            {text}
        </a>
    );
};

Button.propTypes = {
    full: PropTypes.bool,
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func
};

export default Button;
