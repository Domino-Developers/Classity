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

import CardsContainer from '../CardsContainer';
import { createSelector } from '@reduxjs/toolkit';

const sel = createSelector(
    [
        state => state.user.loading,
        state => state.user.coursesEnrolled,
        state => state.user.coursesCreated,
        state => state.user._id
    ],
    (loading, coursesEnrolled, coursesCreated, id) => ({
        loading,
        coursesEnrolled,
        coursesCreated,
        id
    })
);

const Dashboard = () => {
    const { loading, coursesEnrolled, coursesCreated, id } = useSelector(sel);
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

    const { data, error, mutate } = useSWR(loading ? null : `get-custom-course-min-${id}`, () => {
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

            const doneResources = Object.values(progressData.topicStatus).reduce(
                (tot, res) => tot + res.length,
                0
            );
            return {
                ...courseData,
                lastStudied: progressData.lastStudied,
                streak: progressData.streak,
                progress: (doneResources / courseData.totalCoreResources) * 100
            };
        });
        createdCourses = coursesCreated.map(id => data[id].course);
    }

    return (
        <div className='container'>
            <div className='dashboard__header'>
                <h2 className='dashboard__heading'>Dashboard</h2>
                <Button
                    text='Create a course'
                    onClick={() =>
                        addCourse(history, setCreating, course => {
                            mutate({ ...data, [course._id]: { course } }, false);
                            dispatch(addCreatedCourse({ courseId: course._id }));
                        })
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
