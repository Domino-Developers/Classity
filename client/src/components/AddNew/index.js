import React from 'react';

import './AddNew.css';

const AddNew = props => {
    const children = React.Children.toArray(props.children);

    return (
        <div className='add-new'>
            {children.map((child, i) => (
                <a href='#!' onClick={child.props.onAdd} className='add-new-link' key={i}>
                    <i className='fas fa-plus'></i>
                    {child.props.children}
                </a>
            ))}
        </div>
    );
};

export default AddNew;
