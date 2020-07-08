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

import './Resource.css';

const Resource = () => {
    const dispatch = useDispatch();
    const { courseId, topicId, resourceId } = useParams();
    const {
        isAuthenticated,
        loading,
        userData: { id }
    } = useSelector(state => state.auth);

    const { data: course } = useSWR(`get-course-${courseId}`, () => courseApi.get(courseId));
    const { data: topic } = useSWR(`get-topic-${topicId}`, () => topicApi.get(topicId));

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

    /* const resources = [
        {
            kind: 'text',
            name: 'Lorem ipsum dolor sit amet.',
            text:
                'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vero sit dolores veritatis amet in reiciendis optio tempore et voluptatem excepturi, pariatur incidunt non enim nam cumque quod autem, quos aut consectetur reprehenderit tenetur ad laboriosam perspiciatis recusandae? Amet aperiam iste ab sed soluta quia quasi possimus praesentium illo ipsam cum, voluptatem consectetur fugiat nam dolorem a, optio dignissimos laudantium vel enim? Incidunt delectus numquam, dignissimos eaque deleniti explicabo architecto consectetur quibusdam dolorem officiis repellat aut accusamus a, tenetur odit quasi!'
        },
        {
            kind: 'test',
            name: 'Quiz1',
            passScore: '80',
            score: '100'
        }
    ]; */

    const templates = {
        video: props => <Video {...props} instructor={isInstructor} update={update} />,
        text: props => <TextRes {...props} instructor={isInstructor} update={update} />,
        test: props => <TestView {...props} instructor={isInstructor} update={update} />
    };
    if (!resource) return <div>Opps</div>;

    return <div className='main-content'>{templates[resource.kind]({ payload: resource })}</div>;
};

export default Resource;
