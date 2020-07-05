import React from 'react';

import './AddNew.css';

const AddNew = props => {
    const { onAdd, children } = props;

    return (
        <div className='add-new'>
            <a href='#!' onClick={onAdd}>
                <i className='fas fa-plus'></i>
                {children}
            </a>
        </div>
    );
};

export default AddNew;
