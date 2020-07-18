import React from 'react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import { useSelector, useDispatch } from 'react-redux';

import Video from './Video';
import TextRes from './TextRes';
import TestView from './TestView';
import TestEdit from './TestEdit';
import topicApi from '../../api/topic';
import courseApi from '../../api/course';
import Loading from '../../components/Loading';
import { setAlert } from '../Alerts/alertSlice';
import Button from '../../components/Button';
import { createSelector } from '@reduxjs/toolkit';
import { completeCoreResource } from '../User/userSlice';
import { useResourceStatus } from '../../utils/hooks';

const userAndAuth = createSelector(
    [state => state.user.coursesCreated, state => state.user.resourceLoading],
    (coursesCreated, loading) => ({
        loading,
        coursesCreated
    })
);

const Resource = () => {
    const dispatch = useDispatch();
    const { courseId, topicId, resourceId } = useParams();
    const { coursesCreated, loading } = useSelector(userAndAuth);
    const isInstructor = coursesCreated.includes(courseId);
    const resourcesDone = useResourceStatus(!isInstructor, courseId, topicId);
    const { data: course } = useSWR(`get-course-${courseId}`, () => courseApi.get(courseId));
    const { data: topic } = useSWR(`get-topic-${topicId}`, () => topicApi.get(topicId));
    if (!course || !topic) return <Loading />;

    const resource = topic.coreResources.find(res => res._id === resourceId);

    const update = async (newResource, callback) => {
        try {
            await topicApi.setCoreResources(
                topic._id,
                topic.coreResources.map(res => (res._id === newResource._id ? newResource : res))
            );

            if (callback) callback();
        } catch (err) {
            if (err.errors) {
                const errors = err.errors;
                errors.forEach(e => dispatch(setAlert(e.msg, 'danger')));
            }
        }
    };

    const complete = async () => {
        dispatch(completeCoreResource(courseId, topicId, resourceId));
    };

    const templates = {
        video: props => <Video {...props} instructor={isInstructor} update={update} />,
        text: props => <TextRes {...props} instructor={isInstructor} update={update} />,
        test: props =>
            isInstructor ? (
                <TestEdit {...props} />
            ) : (
                <TestView {...props} courseId={courseId} topicId={topicId} resId={resourceId} />
            )
    };
    if (!resource) return <div>Opps</div>;
    const coreResources = topic.coreResources;
    const index = coreResources.findIndex(res => res._id === resourceId);
    const nextResId = index !== coreResources.length - 1 && coreResources[index + 1]._id;
    return (
        <div className='main-content'>
            {templates[resource.kind]({ payload: resource })}
            {resource.kind !== 'test' && (
                <div className='resource__complete'>
                    {!isInstructor &&
                        (resourcesDone.includes(resourceId) ? (
                            <div className='resource__complete-text'>
                                <div className='tick'>&#10003;</div>
                                <div className='complete-text'>Completed</div>
                                {nextResId && (
                                    <Button
                                        text={'Go to next Item'}
                                        full
                                        to={`/course/${courseId}/topic/${topicId}/resource/${nextResId}`}
                                    />
                                )}
                            </div>
                        ) : (
                            <Button
                                text={'Mark Complete'}
                                full
                                onClick={complete}
                                loading={loading && 'Loading'}
                            />
                        ))}
                </div>
            )}
        </div>
    );
};

export default Resource;
