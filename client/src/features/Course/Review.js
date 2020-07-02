import React from 'react';

import Comments from '../Comments';

const Review = ({ reviews }) => (
    <section className='reviews'>
        <h3>Reviews</h3>
        <Comments review comments={reviews} />
    </section>
);

export default Review;
