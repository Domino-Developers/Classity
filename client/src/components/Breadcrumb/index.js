import React from 'react';
import { Link } from 'react-router-dom';

import stripHtml from '../../utils/stripHtml';

const Container = props => {
    const { children } = props;

    return <ul className='breadcrumb'>{children}</ul>;
};

const Item = props => {
    const { to, children } = props;

    return (
        <li className='breadcrumb__item'>
            <Link to={to || '#!'} className='breadcrumb__link'>
                {stripHtml(children)}
            </Link>
        </li>
    );
};

export default { Container, Item };
