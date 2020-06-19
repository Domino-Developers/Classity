import React from 'react';

import './style.css';

const Button = props => {
    const { full, text } = props;
    return <a className={full ? 'btn btn-full' : 'btn btn-ghost'}>{text}</a>;
};

export default Button;
