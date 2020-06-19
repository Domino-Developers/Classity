import React from 'react';

import './Button.css';

const Button = props => {
    const { full, text } = props;
    return (
        <a href='#!' className={full ? 'btn btn-full' : 'btn btn-ghost'}>
            {text}
        </a>
    );
};

export default Button;
