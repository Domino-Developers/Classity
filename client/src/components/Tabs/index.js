import React, { useState, useEffect, Fragment } from 'react';

const Container = props => {
    const [toShow, show] = useState(0);
    const [content, changeContent] = useState('');
    const childrenArr = React.Children.toArray(props.children);

    useEffect(() => {
        if (childrenArr.length <= toShow) show(0);
    }, [childrenArr.length, toShow]);

    return (
        <Fragment>
            <ul className='tab__names'>
                {childrenArr.map((e, i) => (
                    <li className={'tab__item' + (toShow === i ? ' tab__item--show' : '')} key={i}>
                        {React.cloneElement(e, {
                            id: i,
                            toShow,
                            changeContent,
                            show
                        })}
                    </li>
                ))}
                <li className='tab__item tab__item--empty'></li>
            </ul>
            <div className='tab__content'>{content}</div>
        </Fragment>
    );
};

const Tab = props => {
    const { children, changeContent, name, id, toShow, show } = props;

    useEffect(() => {
        if (id === toShow) changeContent(children);
    });

    return (
        <button className='tab__btn' onClick={() => show(id)}>
            {name}
        </button>
    );
};

export default { Container, Tab };
