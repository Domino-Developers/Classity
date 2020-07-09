import React from 'react';
import PropTypes from 'prop-types';

import './Bar.css';

const Bar = props => (
    <div className='bar'>
        <div className='bar-filled' style={{ width: `${props.filled}%` }}></div>
    </div>
);

Bar.propTypes = {
    filled: PropTypes.number.isRequired
};

export default Bar;
