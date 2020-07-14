import React from 'react';

const AddNew = props => {
    const children = React.Children.toArray(props.children);

    return (
        <div className={'add-new ' + (props.className ? props.className : '')}>
            {children.map((child, i) => (
                <a href='#!' onClick={child.props.onAdd} className='add-new__link' key={i}>
                    <i className='fas fa-plus add-new__icon'></i>
                    {child.props.children}
                </a>
            ))}
        </div>
    );
};

export default AddNew;
