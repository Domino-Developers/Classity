import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const Rating = props => {
    const rating = Number(props.rating);
    const select = props.select;

    if (!select) {
        const fullWidth = (15 * rating) / 5 + 'rem';
        const emptyWidth = (15 * (5 - rating)) / 5 + 'rem';
        return (
            <div className='star-rating'>
                <div className='star-rating__full' style={{ width: fullWidth }}></div>
                <div className='star-rating__empty' style={{ width: emptyWidth }}></div>
            </div>
        );
    } else {
        return (
            <div className='star-rating-new'>
                {[5, 4, 3, 2, 1].map(i => (
                    <Fragment key={i}>
                        <input
                            id={`star${i}`}
                            type='radio'
                            name='rating'
                            value={`${i}`}
                            className='star-rating-new__input'
                            defaultChecked={rating === i}
                        />
                        <label
                            htmlFor={`star${i}`}
                            className='star-rating-new__label'
                            onClick={() => select(i)}
                        />
                    </Fragment>
                ))}
            </div>
        );
    }
};

Rating.propTypes = {
    rating: PropTypes.number,
    select: PropTypes.func
};

export default Rating;
