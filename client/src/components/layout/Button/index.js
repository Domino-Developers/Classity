import React from 'react';
import PropTypes from 'prop-types';

import './Button.css';

const Button = props => {
    const { full, text } = props;
    return (
        <a href='#!' className={full ? 'btn btn-full' : 'btn btn-ghost'}>
            {text}
        </a>
    );
};

Button.propTypes = {
    full: PropTypes.bool,
    text: PropTypes.string.isRequired
};

export default Button;
