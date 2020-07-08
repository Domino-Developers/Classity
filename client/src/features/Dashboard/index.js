import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import useSWR from 'swr';
import course from '../../api/course';
import Tabs from '../../components/Tabs';
import Loading from '../../components/Loading';

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
        course.getCustomCoursesMin(reqBody)
    );
    console.log('data', data);
    if (loading || !data) return <Loading />;
    if (error && navigator.onLine) return <div>Opps</div>;

    return (
        <div className='container'>
            <h1 className='dashboard-heading'>Dashboard</h1>
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
