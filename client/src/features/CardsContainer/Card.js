import React from 'react';
import Rating from '../../components/Rating';

const CourseCard = () => {
    return (
        <div className='course-card'>
            <div className='card-img'>
                <img src={require('./img/course.jpeg')} alt='nope' />
            </div>
            <div className='card-title-container'>
                <h4 className='card-title'>Lorem ipsum dolor sit amet.</h4>
            </div>
            <div className='card-ins'>Lorem, ipsum.</div>
            <div className='card-rating'>
                <Rating rating='3' />
                <p>3</p>
                <p>(1000)</p>
            </div>
        </div>
    );
};

export default CourseCard;
