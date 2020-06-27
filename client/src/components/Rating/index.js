import React from 'react';
import PropTypes from 'prop-types';

import './Rating.css';

const Rating = props => {
    const rating = Number(props.rating);
    const fullWidth = (7.5 * rating) / 5 + 'rem';
    const emptyWidth = (7.5 * (5 - rating)) / 5 + 'rem';
    return (
        <div className='star-rating'>
            <div
                className='star-rating-full'
                style={{ width: fullWidth }}
            ></div>
            <div
                className='star-rating-empty'
                style={{ width: emptyWidth }}
            ></div>
        </div>
    );
};

Rating.propTypes = {
    rating: PropTypes.number.isRequired
};

export default Rating;
