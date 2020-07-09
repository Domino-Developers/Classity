import React from 'react';
import PropTypes from 'prop-types';

import Rating from '../../components/Rating';
import Bar from '../../components/Bar';

const Feedback = props => {
    const { course } = props;
    const { reviews } = course;
    const total = reviews.length;

    const percent = rating => (reviews.filter(rev => rev.rating === rating).length / total) * 100;

    return (
        <section>
            <h2>Student Feedback</h2>
            <div className='feedback'>
                <div className='big-rating'>
                    <p>{course.avgRating}</p>
                    <Rating rating={course.avgRating} />
                </div>
                <Bar filled={percent(5)} />
                <div className='rating rating-5'>
                    <Rating rating={5} />
                    <p>{percent(5)}%</p>
                </div>
                <Bar filled={percent(4)} />
                <div className='rating rating-4'>
                    <Rating rating={4} />
                    <p>{percent(4)}%</p>
                </div>
                <Bar filled={percent(3)} />
                <div className='rating rating-3'>
                    <Rating rating={3} />
                    <p>{percent(3)}%</p>
                </div>
                <Bar filled={percent(2)} />
                <div className='rating rating-2'>
                    <Rating rating={2} />
                    <p>{percent(2)}%</p>
                </div>
                <Bar filled={percent(1)} />
                <div className='rating rating-1'>
                    <Rating rating={1} />
                    <p>{percent(1)}%</p>
                </div>
            </div>
        </section>
    );
};

Feedback.propTypes = {
    course: PropTypes.object.isRequired
};

export default Feedback;
