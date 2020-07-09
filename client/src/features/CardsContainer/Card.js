import React, { Fragment } from 'react';
import Rating from '../../components/Rating';
import { Link } from 'react-router-dom';

import Html from '../../components/Html';

const CourseCard = props => {
    const {
        _id,
        avgRating,
        instructor: { name: instructor },
        name
    } = props.course;

    const progress = props.progress;

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
                {!progress ? (
                    <div className='card-rating'>
                        <Rating rating={avgRating} />
                        <p>{avgRating.toFixed(1)}</p>
                    </div>
                ) : (
                    <Fragment>
                        <div className='card-last-study'>Last studied: {'10 days ago'}</div>
                        <div className='card-progress' style={{ width: `${progress}%` }}></div>
                        <div className='card-streak'>
                            <span className='number'>
                                <i className='fas fa-fire'></i>10
                            </span>
                            <p>streak</p>
                        </div>
                    </Fragment>
                )}
            </div>
        </Link>
    );
};

export default CourseCard;
