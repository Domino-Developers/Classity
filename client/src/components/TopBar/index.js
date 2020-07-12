import React, { Fragment, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import useSWR from 'swr';
import Breadcrumb from '../Breadcrumb';
import CircularProgress from '../CircularProgress';
import Loading from '../Loading';

//apis
import courseApi from '../../api/course';

const TopBar = ({ params, setExist }) => {
    const { courseId, topicId } = params;
    let resourceId = null;
    const match = useRouteMatch('/course/:courseId/topic/:topicId/resource/:resourceId');
    const id = useSelector(state => state.user._id);
    const { data: course, error: courseError } = useSWR(
        courseId ? `get-course-${courseId}` : null,
        () => courseApi.get(courseId)
    );

    if (match) resourceId = match.params.resourceId;

    let exist = true;
    useEffect(() => {
        if (!exist) setExist(false);
    });

    if (courseError && navigator.onLine) exist = false;
    if (!course) return <Loading />;

    const navList = [{ name: course.name, link: `/course/${courseId}` }];

    const topic = course.topics.find(top => top._id === topicId);
    if (!topic) {
        exist = false;
        return <Loading />;
    }
    navList.push({ name: topic.name, link: `/course/${courseId}/topic/${topicId}` });

    if (resourceId) {
        const resource = topic.coreResources.find(res => res._id === resourceId);
        if (!resource) {
            exist = false;
            return <Loading />;
        }
        navList.push({ name: resource.name });
    }

    const instructor = course.instructor._id === id;

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
                        <CircularProgress size='50' progress={80} />
                    </div>
                )}
            </div>
        </Fragment>
    );
};

export default TopBar;
