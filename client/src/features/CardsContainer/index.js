import React from 'react';
import PropTypes from 'prop-types';
import Card from './Card';

const CardsContainer = ({ courses, normal }) => {
    return (
        <div className='cards-container'>
            {courses.map((course, i) => (
                <Card course={course} key={i} normal={normal} />
            ))}
        </div>
    );
};

CardsContainer.propTypes = {
    courses: PropTypes.array.isRequired,
    normal: PropTypes.bool
};

export default CardsContainer;
