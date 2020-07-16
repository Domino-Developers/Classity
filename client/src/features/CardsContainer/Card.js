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
        streak,
        tags,
        imageURL
    } = props.course;

    return (
        <Link to={`/course/${_id}`} className='card'>
            <img className='card__img' src={imageURL} alt={name} />

            <Html tag='h4' className='card__title'>
                {name}
            </Html>
            <div className='card__tags'>
                {tags.map((tag, i) => (
                    <span key={i} className='card__tag'>
                        {tag}
                    </span>
                ))}
            </div>
            <div className='card__instructor'>{instructor}</div>
            {props.normal ? (
                <div className='card__rating'>
                    <Rating rating={avgRating} />
                    <p>{avgRating.toFixed(1)}</p>
                </div>
            ) : (
                <Fragment>
                    <div className='card__last-study'>
                        Last studied: <FromNow date={lastStudied} />
                    </div>
                    <div className='card__progress' style={{ width: `${progress}%` }}></div>
                    <div className='card__streak'>
                        <span className='number'>
                            <i className='fas fa-fire'></i>
                            {streak}
                        </span>
                        <p>streak</p>
                    </div>
                </Fragment>
            )}
        </Link>
    );
};

CourseCard.propTypes = {
    course: PropTypes.object.isRequired,
    normal: PropTypes.bool
};

export default CourseCard;
