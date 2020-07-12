import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import useSWR from 'swr';

import courseStore from '../../api/course';
import Tabs from '../../components/Tabs';
import Loading from '../../components/Loading';
import Button from '../../components/Button';
import { addCourse } from './helper';
import { addCreatedCourse, addCourseProgress } from '../User/userSlice';

import './Dashboard.css';
import CardsContainer from '../CardsContainer';
import { createSelector } from '@reduxjs/toolkit';

const sel = createSelector(
    [
        state => state.user.loading,
        state => state.user.coursesEnrolled,
        state => state.user.coursesCreated
    ],
    (loading, coursesEnrolled, coursesCreated) => ({
        loading,
        coursesEnrolled,
        coursesCreated
    })
);

const Dashboard = () => {
    const { loading, coursesEnrolled, coursesCreated } = useSelector(sel);
    let reqBody;
    if (!loading) {
        reqBody = [
            ...Object.keys(coursesEnrolled)
                .map(k => ({
                    _id: k,
                    courseProgressId: coursesEnrolled[k]
                }))
                .map(c => {
                    if (typeof c.courseProgressId === 'string') return c;
                    else return { _id: c._id };
                }),
            ...coursesCreated.map(c => ({ _id: c }))
        ];
    }

    const { data, error } = useSWR(loading ? null : 'get-custom-course-min', () => {
        console.log('fetching');
        return courseStore.getCustomCoursesMin(reqBody);
    });
    const [creating, setCreating] = useState(false);
    const history = useHistory();
    const dispatch = useDispatch();

    if (error && navigator.onLine) return <div>Opps</div>;

    let enrolledCourses, createdCourses;
    if (data) {
        enrolledCourses = Object.keys(coursesEnrolled).map(id => {
            const courseData = data[id].course;
            let progressData;

            if (data[id].courseProgress && typeof coursesEnrolled[id] === 'string') {
                dispatch(
                    addCourseProgress({ courseId: id, courseProgress: data[id].courseProgress })
                );
                progressData = data[id].courseProgress;
            } else {
                progressData = coursesEnrolled[id];
            }

            return {
                ...courseData,
                lastStudied: progressData.lastStudied,
                streak: progressData.streak,
                progress: progressData.precentageCompleted
            };
        });
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
