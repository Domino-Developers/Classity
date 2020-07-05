import React from 'react';
import { Link } from 'react-router-dom';

import './Breadcrumb.css';

const Container = props => {
    const { children } = props;

    return <ul className='breadcrumb'>{children}</ul>;
};

const Item = props => {
    const { to, children } = props;

    return (
        <li>
            <Link to={to || '#!'} className='bread-link'>
                {children}
            </Link>
        </li>
    );
};

export default { Container, Item };
