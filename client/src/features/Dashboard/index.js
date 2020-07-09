import React, { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import useSWR from 'swr';

import courseStore from '../../api/course';
import Tabs from '../../components/Tabs';
import Loading from '../../components/Loading';
import Button from '../../components/Button';
import { addCourse } from './helper';
import { addCreatedCourse } from '../Auth/authSlice';

import './Dashboard.css';

const Dashboard = () => {
    const {
        loading,
        userData: { coursesCreated, coursesEnrolled }
    } = useSelector(state => state.auth);

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

    if (loading || !data) return <Loading />;
    if (error && navigator.onLine) return <div>Opps</div>;

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
            <Tabs.Container>
                <Tabs.Tab name='Enrolled'>
                    {Object.keys(coursesEnrolled).map((id, i) => {
                        const courseToShow = data[id].course;
                        const courseProgress = data[id].courseProgress;

                        // Put your card here!

                        return (
                            <div key={i} className='course'>
                                {courseToShow.name} -&gt; {courseProgress.precentageCompleted}
                            </div>
                        );
                    })}
                </Tabs.Tab>
                <Tabs.Tab name='Created'>
                    {coursesCreated.map((id, i) => (
                        // put your card here
                        <p key={i}>{data[id].course.name}</p>
                    ))}
                </Tabs.Tab>
            </Tabs.Container>
        </div>
    );
};

export default Dashboard;
