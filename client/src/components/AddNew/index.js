import React, { Fragment } from 'react';

const AddNew = props => {
    const children = React.Children.toArray(props.children);

    return (
        <Fragment>
            {props.guide && (
                <div className='u-center-text'>
                    <span className='add-new__guide'>Start adding content by hovering here.</span>
                </div>
            )}
            <div className={'add-new ' + (props.className ? props.className : '')}>
                {children.map((child, i) => (
                    <a href='#!' onClick={child.props.onAdd} className='add-new__link' key={i}>
                        <i className='fas fa-plus add-new__icon'></i>
                        {child.props.children}
                    </a>
                ))}
            </div>
        </Fragment>
    );
};

export default AddNew;
