import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Rating from '../../components/Rating';

const Feedback = props => {
    const { course } = props;
    const { reviews } = course;
    const total = reviews.length;

    const percent = rating => (reviews.filter(rev => rev.rating === rating).length / total) * 100;

    return (
        <section>
            <h2>Student Feedback</h2>
            <div className='feedback'>
                <div className='feedback__big-rating'>
                    <p className='feedback__big-text'>{course.avgRating}</p>
                    <Rating rating={course.avgRating} />
                </div>
                {[5, 4, 3, 2, 1].map(i => (
                    <Fragment key={i}>
                        <div className='feedback__bar'>
                            <div
                                className='feedback__bar-filled'
                                style={{ width: `${percent(i)}%` }}></div>
                        </div>
                        <div className='feedback__rating'>
                            <Rating rating={i} />
                            <p>{percent(i)}%</p>
                        </div>
                    </Fragment>
                ))}
            </div>
        </section>
    );
};

Feedback.propTypes = {
    course: PropTypes.object.isRequired
};

export default Feedback;
