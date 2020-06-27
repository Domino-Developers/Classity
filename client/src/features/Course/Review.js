import React from 'react';

import Comments from '../Comments';

const Review = () => (
    <section className='reviews'>
        <h3>Reviews</h3>
        <Comments review comments={[1, 2, 3]} />
    </section>
);

export default Review;
