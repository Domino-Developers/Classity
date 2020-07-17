import React from 'react';
import loadable from '@loadable/component';

import Goals from './Goals';
import Header from './Header';
import Loading from '../Loading';

import useSWR from 'swr';
import courseStore from '../../api/course';

const CardsContainer = loadable(() => import('../../features/CardsContainer'));

const Landing = () => {
    const { data: courses, error } = useSWR('get-all-course-min', courseStore.getAllCoursesMin);

    return (
        <div>
            <Header />
            <Goals />
            <div className='container' id='explore'>
                {courses ? (
                    <CardsContainer courses={courses} fallback={<Loading />} normal />
                ) : error ? (
                    <div>Opps</div>
                ) : (
                    <Loading />
                )}
            </div>
        </div>
    );
};

export default Landing;
