import React, { Fragment, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import useSWR from 'swr';
import Breadcrumb from '../Breadcrumb';
import Loading from '../Loading';

//apis
import courseApi from '../../api/course';
import topicApi from '../../api/topic';
import { createSelector } from '@reduxjs/toolkit';
import ProgressCircle from './ProgressCircle';

const CoursesCreatedSelector = createSelector(
    state => state.user.coursesCreated,
    coursesCreated => coursesCreated
);

const TopBar = ({ params, setExist }) => {
    const { courseId, topicId } = params;
    const match = useRouteMatch('/course/:courseId/topic/:topicId/resource/:resourceId');
    const coursesCreated = useSelector(CoursesCreatedSelector);
    const { data: course, error: courseError } = useSWR(`get-course-${courseId}`, () =>
        courseApi.get(courseId)
    );
    const { data: topic, error: topicError } = useSWR(`get-topic-${topicId}`, () =>
        topicApi.get(topicId)
    );
    const instructor = coursesCreated.includes(courseId);

    let resourceId = null;
    if (match) resourceId = match.params.resourceId;

    let exist = true;
    useEffect(() => {
        if (!exist) setExist(false);
    });

    if ((courseError || topicError) && navigator.onLine) exist = false;
    if (!course || !topic) return <Loading />;

    const navList = [
        { name: course.name, link: `/course/${courseId}` },
        { name: topic.name, link: `/course/${courseId}/topic/${topicId}` }
    ];

    if (resourceId) {
        const resource = topic.coreResources.find(res => res._id === resourceId);
        if (!resource) {
            exist = false;
            return <Loading />;
        }
        navList.push({ name: resource.name });
    }

    return (
        <Fragment>
            <div className='topbar'>
                <div className='topbar__left'>
                    <Breadcrumb.Container>
                        {navList.map((item, i) => (
                            <Breadcrumb.Item key={i} to={item.link}>
                                {item.name}
                            </Breadcrumb.Item>
                        ))}
                    </Breadcrumb.Container>
                </div>
                {!instructor && <ProgressCircle instructor={instructor} course={course} />}
            </div>
        </Fragment>
    );
};

export default TopBar;
