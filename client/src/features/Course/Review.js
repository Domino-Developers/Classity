import React from 'react';
import PropTypes from 'prop-types';

import Comments from '../Comments';

const Review = ({ reviews }) => (
    <section className='reviews'>
        <h3>Reviews</h3>
        <Comments review comments={reviews} />
    </section>
);

Review.propTypes = {
    reviews: PropTypes.array.isRequired
};

export default Review;
