import React, { Fragment, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import useSWR from 'swr';
import Breadcrumb from '../Breadcrumb';
import CircularProgress from '../CircularProgress';
import Loading from '../Loading';

//apis
import courseApi from '../../api/course';
import topicApi from '../../api/topic';
import { createSelector } from '@reduxjs/toolkit';

const makeSelector = courseId =>
    createSelector(
        state => state.user.coursesEnrolled[courseId],
        // (_, courseId) => courseId,
        courseEnrolled => courseEnrolled.precentageCompleted
    );
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
    const sel = useMemo(() => (!instructor ? makeSelector(courseId) : () => null), [
        courseId,
        instructor
    ]);
    const progress = useSelector(state => sel(state, courseId));

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
                {!instructor && (
                    <div className='topbar__right'>
                        Your progress
                        <CircularProgress size='50' progress={progress} />
                    </div>
                )}
            </div>
        </Fragment>
    );
};

export default TopBar;
