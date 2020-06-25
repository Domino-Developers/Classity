import React, { useState } from 'react';
import './SideBar.css';
import Collapse from '../Collapse';

const Container = ({ children }) => {
    let [toShow, show] = useState(true);

    return (
        <div className='sidebar'>
            <div
                className={'sidebar-list' + (toShow ? '' : ' collapsed')}
                aria-hidden={toShow}
            >
                <Collapse.Container>{children}</Collapse.Container>
            </div>
            <div
                className='sidebar-close'
                onClick={() => {
                    show(!toShow);
                }}
            >
                <button>
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

const Item = ({ children, ...rest }) => (
    <Collapse.Item {...rest}> {children} </Collapse.Item>
);
export default { Container, Tab, Item };
