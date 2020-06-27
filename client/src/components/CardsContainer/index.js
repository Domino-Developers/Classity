import React from 'react';
import CourseCard from './Card';

import './Card.css';

const CardsContainer = () => {
    let list = [1, 2, 3, 4, 5, 6];
    return (
        <div className='cards-container'>
            {list.map(i => (
                <CourseCard key={i} />
            ))}
        </div>
    );
};

export default CardsContainer;
