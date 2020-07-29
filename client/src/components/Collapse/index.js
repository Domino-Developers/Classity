import React, { useState, Fragment } from 'react';
import AnimateHeight from 'react-animate-height';
import { Link } from 'react-router-dom';

import AddNew from '../AddNew';
import Editable from '../Editable';
import Html from '../Html';

const Container = props => {
    const { editing, children } = props;
    const [toShow, show] = useState('head');

    const toggleShow = e => {
        const current = document.getElementById(toShow);
        if (current) {
            current.classList.remove('collapse__item--show');
            current.classList.add('collapse__item--hide');
        }

        const parent = e.target.closest('li');
        if (parent.id !== toShow) {
            parent.classList.add('collapse__item--show');
            parent.classList.remove('collapse__item--hide');
            show(parent.id);
        } else {
            show('head');
        }
    };

    return (
        <ul className='collapse'>
            {React.Children.toArray(children).map((e, i) => (
                <li className='collapse__item collapse__item--hide' id={'head' + i} key={i}>
                    {React.cloneElement(e, {
                        id: 'head' + i,
                        toShow,
                        toggleShow,
                        editing
                    })}
                </li>
            ))}
        </ul>
    );
};

const Head = props => {
    const { text, toggleShow, toShow, id, editing, children, onChange, onDelete, to } = props;

    const editable = onChange ? true : false;

    return (
        <Fragment>
            {editing && editable ? (
                <p className='collapse__text collapse__text--outer'>
                    <i
                        className='fas fa-minus delete-btn u-margin-right-small'
                        onClick={onDelete}></i>
                    <Editable html={text} onChange={onChange} tagName='span' />
                </p>
            ) : (
                text && (
                    <p className='collapse__text collapse__text--outer' onClick={toggleShow}>
                        <i className='fas fa-plus collapse__btn collapse__btn--show'></i>
                        <i className='fas fa-minus collapse__btn collapse__btn--hide'></i>
                        <Html>{text}</Html>
                        {to && (
                            <Link className='collapse__link--icon' to={to}>
                                &rarr;
                            </Link>
                        )}
                    </p>
                )
            )}

            <AnimateHeight height={toShow === id || editing ? 'auto' : 0}>
                <ul>
                    {React.Children.toArray(children).map((e, i) => (
                        <Fragment key={i}>{React.cloneElement(e, { editing })}</Fragment>
                    ))}
                </ul>
            </AnimateHeight>
        </Fragment>
    );
};

const Item = props => {
    const { children, editing, onAdd, to, className, guide } = props;

    return (
        <li>
            {editing && onAdd ? (
                <AddNew guide={guide}>
                    <span onAdd={onAdd}>{children}</span>
                </AddNew>
            ) : (
                !onAdd &&
                (to ? (
                    <Link to={to} className='collapse__link'>
                        <p
                            className={
                                'collapse__text collapse__text--inner ' +
                                (className ? className : '')
                            }>
                            {children}
                        </p>
                    </Link>
                ) : (
                    <p
                        className={
                            'collapse__text collapse__text--inner ' + (className ? className : '')
                        }>
                        {children}
                    </p>
                ))
            )}
        </li>
    );
};

export default { Container, Head, Item };
