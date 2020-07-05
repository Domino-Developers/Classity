import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import useSWR from 'swr';
import Breadcrumb from '../Breadcrumb';
import CircularProgress from '../CircularProgress';
import Loading from '../Loading';

//apis
import courseApi from '../../api/course';

import './TopBar.css';

const TopBar = ({ params }) => {
    const { courseId, topicId } = params;
    let resourceId = null;
    const match = useRouteMatch('/course/:courseId/topic/:topicId/resource/:resourceId');
    const { id } = useSelector(state => state.auth.userData);
    const { data: course, error } = useSWR(courseId ? `get-course-${courseId}` : null, () =>
        courseApi.get(courseId)
    );

    if (match) {
        resourceId = match.params.resourceId;
    }

    if (error && navigator.onLine) return <div>Opps</div>;
    if (!course) return <Loading />;

    const navList = [course.name];
    if (topicId) {
        const topic = course.topics.find(top => top._id === topicId);
        navList.push(topic.name);
        if (resourceId) {
            navList.push(topic.coreResources.find(res => res.id === resourceId).name);
        }
    }

    const instructor = course.instructor._id === id;

    return (
        <Fragment>
            <div className='topbar'>
                <div className='topbar-left'>
                    <Breadcrumb.Container>
                        {navList.map((l, i) => (
                            <Breadcrumb.Item key={i}>{l}</Breadcrumb.Item>
                        ))}
                    </Breadcrumb.Container>
                </div>
                {!instructor && (
                    <div className='topbar-right'>
                        Your progress
                        <CircularProgress size='50' progress={80} />
                    </div>
                )}
            </div>
        </Fragment>
    );
};

export default TopBar;
