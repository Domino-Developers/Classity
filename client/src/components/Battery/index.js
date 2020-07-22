import React from 'react';
import PropTypes from 'prop-types';

const Battery = ({ power }) => (
    <div className='battery'>
        <span className='battery__tooltip'>Energy left</span>
        <div className='battery__circle'></div>
        {[4, 3, 2, 1].map(i => (
            <div
                key={i}
                className={'battery__item' + (power >= i ? ' battery__item--full' : '')}></div>
        ))}
    </div>
);

Battery.propTypes = {
    power: PropTypes.number.isRequired
};

export default Battery;
