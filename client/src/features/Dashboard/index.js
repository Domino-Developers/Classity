import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import useSWR from 'swr';

import courseStore from '../../api/course';
import Tabs from '../../components/Tabs';
import Loading from '../../components/Loading';
import Button from '../../components/Button';
import { addCourse } from './helper';
import { addCreatedCourse } from '../User/userSlice';

import './Dashboard.css';
import CardsContainer from '../CardsContainer';

const Dashboard = () => {
    const { loading, coursesEnrolled, coursesCreated } = useSelector(state => state.user);
    const reqBody = [
        ...Object.keys(coursesEnrolled).map(k => ({
            _id: k,
            courseProgressId: coursesEnrolled[k]
        })),
        ...coursesCreated.map(c => ({ _id: c }))
    ];

    const { data, error } = useSWR(`get-custom-course-min-${JSON.stringify(reqBody)}`, () =>
        courseStore.getCustomCoursesMin(reqBody)
    );
    const [creating, setCreating] = useState(false);
    const history = useHistory();
    const dispatch = useDispatch();

    if (error && navigator.onLine) return <div>Opps</div>;

    let enrolledCourses, createdCourses;
    if (data) {
        enrolledCourses = Object.keys(coursesEnrolled).map(id => ({
            ...data[id].course,
            lastStudied: data[id].courseProgress.lastStudied,
            streak: data[id].courseProgress.streak,
            progress: data[id].courseProgress.precentageCompleted
        }));
        createdCourses = coursesCreated.map(id => data[id].course);
    }

    return (
        <div className='container'>
            <div className='dashboard-header'>
                <h1 className='dashboard-heading'>Dashboard</h1>
                <Button
                    text='Create a course'
                    onClick={() =>
                        addCourse(history, setCreating, id =>
                            dispatch(addCreatedCourse({ courseId: id }))
                        )
                    }
                    loading={creating}
                />
            </div>
            {loading || !data ? (
                <Loading />
            ) : (
                <Tabs.Container>
                    <Tabs.Tab name='Enrolled'>
                        <CardsContainer courses={enrolledCourses} />
                    </Tabs.Tab>
                    <Tabs.Tab name='Created'>
                        <CardsContainer courses={createdCourses} normal />
                    </Tabs.Tab>
                </Tabs.Container>
            )}
        </div>
    );
};

export default Dashboard;
