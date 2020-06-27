import React, { useState, useEffect, Fragment } from 'react';

import './Tabs.css';

const Container = props => {
    const [toShow, show] = useState(0);
    const [content, changeContent] = useState('');
    const childrenArr = React.Children.toArray(props.children);

    useEffect(() => {
        if (childrenArr.length <= toShow) show(0);
    }, [childrenArr.length, toShow]);

    return (
        <Fragment>
            <ul className='tab-names'>
                {childrenArr.map((e, i) => {
                    const className = toShow === i ? 'show' : 'hide';

                    return (
                        <li className={className} key={i}>
                            {React.cloneElement(e, {
                                id: i,
                                toShow,
                                changeContent,
                                show
                            })}
                        </li>
                    );
                })}
                <li className='no-tab'></li>
            </ul>
            <div className='tab-content'>{content}</div>
        </Fragment>
    );
};

const Tab = props => {
    const { children, changeContent, name, id, toShow, show } = props;

    useEffect(() => {
        if (id === toShow) changeContent(children);
    });

    return <button onClick={() => show(id)}>{name}</button>;
};

export default { Container, Tab };
