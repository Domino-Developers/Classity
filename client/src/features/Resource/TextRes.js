import React, { Fragment } from 'react';

const TextRes = ({ payload }) => {
    return (
        <Fragment>
            <h2 className='text-heading'> {payload.name} </h2>
            <div className='text-container'>{payload.text}</div>
        </Fragment>
    );
};

export default TextRes;
