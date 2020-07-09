import React from 'react';
import PropTypes from 'prop-types';

import './Rating.css';

const Rating = props => {
    const rating = Number(props.rating);
    const select = props.select;

    if (!select) {
        const fullWidth = (7.5 * rating) / 5 + 'rem';
        const emptyWidth = (7.5 * (5 - rating)) / 5 + 'rem';
        return (
            <div className='star-rating'>
                <div className='star-rating-full' style={{ width: fullWidth }}></div>
                <div className='star-rating-empty' style={{ width: emptyWidth }}></div>
            </div>
        );
    } else {
        return (
            <div className='star-rating-new'>
                <input
                    id='star5'
                    type='radio'
                    name='rating'
                    value='5'
                    className='star-rating-input'
                    defaultChecked={rating === 5}
                />
                <label htmlFor='star5' className='star-rating-label' onClick={() => select(5)} />

                <input
                    id='star4'
                    type='radio'
                    name='rating'
                    value='4'
                    className='star-rating-input'
                    defaultChecked={rating === 4}
                />
                <label htmlFor='star4' className='star-rating-label' onClick={() => select(4)} />

                <input
                    id='star3'
                    type='radio'
                    name='rating'
                    value='3'
                    className='star-rating-input'
                    defaultChecked={rating === 3}
                />
                <label htmlFor='star3' className='star-rating-label' onClick={() => select(3)} />

                <input
                    id='star2'
                    type='radio'
                    name='rating'
                    value='2'
                    className='star-rating-input'
                    defaultChecked={rating === 2}
                />
                <label htmlFor='star2' className='star-rating-label' onClick={() => select(2)} />

                <input
                    id='star1'
                    type='radio'
                    name='rating'
                    value='1'
                    className='star-rating-input'
                    defaultChecked={rating === 1}
                />
                <label htmlFor='star1' className='star-rating-label' onClick={() => select(1)} />
            </div>
        );
    }
};

Rating.propTypes = {
    rating: PropTypes.number,
    select: PropTypes.func
};

export default Rating;
