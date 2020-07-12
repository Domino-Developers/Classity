import React from 'react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import { useSelector, useDispatch } from 'react-redux';

import Video from './Video';
import TextRes from './TextRes';
import TestView from './TestView';
import topicApi from '../../api/topic';
import courseApi from '../../api/course';
import Loading from '../../components/Loading';
import { setAlert } from '../Alerts/alertSlice';

const Resource = () => {
    const dispatch = useDispatch();
    const { courseId, topicId, resourceId } = useParams();
    const { isAuthenticated, loading: loading1 } = useSelector(state => state.auth);

    const { _id: id, loading: loading2 } = useSelector(state => state.user);

    const { data: course } = useSWR(`get-course-${courseId}`, () => courseApi.get(courseId));
    const { data: topic } = useSWR(`get-topic-${topicId}`, () => topicApi.get(topicId));

    const loading = loading1 || loading2;
    if (!course || !topic) return <Loading />;

    const isInstructor = !loading && isAuthenticated && course.instructor._id === id;

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

    const templates = {
        video: props => <Video {...props} instructor={isInstructor} update={update} />,
        text: props => <TextRes {...props} instructor={isInstructor} update={update} />,
        test: props => <TestView {...props} instructor={isInstructor} update={update} />
    };
    if (!resource) return <div>Opps</div>;

    return <div className='main-content'>{templates[resource.kind]({ payload: resource })}</div>;
};

export default Resource;
