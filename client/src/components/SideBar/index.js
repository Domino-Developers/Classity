import React, { useState } from 'react';

import Collapse from '../Collapse';

const Container = ({ children }) => {
    const smallScreenQuery = window.matchMedia('(max-width: 62.5em)');

    const [toShow, show] = useState(smallScreenQuery.matches ? false : true);

    return (
        <div className='sidebar'>
            <div
                className={'sidebar__list' + (toShow ? '' : ' sidebar__list--collapsed')}
                aria-hidden={toShow}>
                <Collapse.Container>{children}</Collapse.Container>
            </div>
            <div
                className='sidebar__close'
                onClick={() => {
                    show(!toShow);
                }}>
                <button className='sidebar__btn'>
                    <i className='fas fa-list-ul'></i>
                </button>
            </div>
        </div>
    );
};

const Tab = ({ text, children, ...rest }) => (
    <Collapse.Head text={text} {...rest}>
        {children}
    </Collapse.Head>
);

const Item = ({ children, ...rest }) => <Collapse.Item {...rest}> {children} </Collapse.Item>;
export default { Container, Tab, Item };
