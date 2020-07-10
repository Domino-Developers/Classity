import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Rating from '../../components/Rating';
import { Link } from 'react-router-dom';
import FromNow from '../../components/FromNow';

import Html from '../../components/Html';

const CourseCard = props => {
    const {
        _id,
        avgRating,
        instructor: { name: instructor },
        name,
        lastStudied,
        progress,
        streak
    } = props.course;
    return (
        <Link to={`/course/${_id}`}>
            <div className='course-card'>
                <div className='card-img'>
                    <img src={require('./img/course.jpeg')} alt='nope' />
                </div>
                <div className='card-title-container'>
                    <Html tag='h4' className='card-title'>
                        {name}
                    </Html>
                </div>
                <div className='card-ins'>{instructor}</div>
                {props.normal ? (
                    <div className='card-rating'>
                        <Rating rating={avgRating} />
                        <p>{avgRating.toFixed(1)}</p>
                    </div>
                ) : (
                    <Fragment>
                        <div className='card-last-study'>
                            Last studied: <FromNow date={lastStudied} />
                        </div>
                        <div className='card-progress' style={{ width: `${progress}%` }}></div>
                        <div className='card-streak'>
                            <span className='number'>
                                <i className='fas fa-fire'></i>
                                {streak}
                            </span>
                            <p>streak</p>
                        </div>
                    </Fragment>
                )}
            </div>
        </Link>
    );
};

CourseCard.propTypes = {
    course: PropTypes.object.isRequired,
    normal: PropTypes.bool
};

export default CourseCard;
