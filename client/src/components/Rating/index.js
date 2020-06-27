import React from 'react';
import PropTypes from 'prop-types';

import './Rating.css';

const Rating = props => {
    const rating = Number(props.rating);
    return (
        <div className='star-rating'>
            {rating >= 1 ? <FullStar /> : <EmptyStar />}
            {rating >= 2 ? <FullStar /> : <EmptyStar />}
            {rating >= 3 ? <FullStar /> : <EmptyStar />}
            {rating >= 4 ? <FullStar /> : <EmptyStar />}
            {rating >= 5 ? <FullStar /> : <EmptyStar />}
        </div>
    );
};

const FullStar = () => (
    <img src={require('../../img/star-full.png')} alt='Full star' />
);

const EmptyStar = () => (
    <img src={require('../../img/star-empty.png')} alt='Empty star' />
);

Rating.propTypes = {
    rating: PropTypes.string.isRequired
};

export default Rating;
