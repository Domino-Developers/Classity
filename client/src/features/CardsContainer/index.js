import React from 'react';
import PropTypes from 'prop-types';
import useSWR from 'swr';

import Loading from '../../components/Loading';

import course from '../../api/course';

import Card from './Card';

import './Card.css';

const CardsContainer = props => {
    let key, getFunction;
    switch (props.get) {
        case 'all':
            key = 'all-courses-min';
            getFunction = course.getAllCoursesMin;
            break;
        default:
    }

    const { data } = useSWR(key, getFunction);

    return (
        <div className='cards-container'>
            {data ? (
                data.map((course, i) => <Card course={course} key={i} />)
            ) : (
                <Loading />
            )}
        </div>
    );
};

CardsContainer.propTypes = {
    get: PropTypes.oneOf(['all'])
};

export default CardsContainer;
