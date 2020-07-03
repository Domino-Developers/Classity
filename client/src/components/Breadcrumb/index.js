import React from 'react';
import { Link } from 'react-router-dom';

import Button from '../Button';
import CircularProgress from '../CircularProgress';

import './Breadcrumb.css';

const Container = props => {
    const { children, instructor, edit, editing, onSave } = props;

    return (
        <ul className='breadcrumb'>
            {children}
            <li>
                {instructor && !editing && (
                    <Button text='Edit' onClick={() => edit(true)} />
                )}
                {instructor && editing && (
                    <Button
                        text='Save'
                        onClick={() => {
                            edit(false);
                            onSave();
                        }}
                    />
                )}
            </li>
            <li>
                {!instructor && (
                    <div className='breadcrumb-progress'>
                        Your progress
                        <CircularProgress size='50' progress={80} />
                    </div>
                )}
            </li>
        </ul>
    );
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
