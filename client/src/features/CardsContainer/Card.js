import React from 'react';
import Rating from '../../components/Rating';

const CourseCard = props => {
    const {
        avgRating,
        instructor: { name: instructor },
        name
    } = props.course;

    return (
        <div className='course-card'>
            <div className='card-img'>
                <img src={require('./img/course.jpeg')} alt='nope' />
            </div>
            <div className='card-title-container'>
                <h4 className='card-title'>{name}</h4>
            </div>
            <div className='card-ins'>{instructor}</div>
            <div className='card-rating'>
                <Rating rating={avgRating} />
                <p>{avgRating.toFixed(1)}</p>
                {/* <p>(1000)</p> */}
            </div>
        </div>
    );
};

export default CourseCard;
