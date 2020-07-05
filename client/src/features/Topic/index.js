import React, { Fragment, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { useSelector, useDispatch } from 'react-redux';

import courseApi from '../../api/course';
import topicApi from '../../api/topic';

import Editable from '../../components/Editable';
import Tabs from '../../components/Tabs';
import FadeText from '../../components/FadeText';
import Loading from '../../components/Loading';
import Comments from '../Comments';
import AddNew from '../../components/AddNew';
import Delete from '../../components/Delete';
import Button from '../../components/Button';
import { useEdit } from '../../utils/hooks';
import { setAlert } from '../Alerts/alertSlice';

import './Topic.css';

const Topic = () => {
    const dispatch = useDispatch();
    const { courseId, topicId } = useParams();
    const {
        isAuthenticated,
        loading,
        userData: { id }
    } = useSelector(state => state.auth);

    const { data: course } = useSWR(`get-course-${courseId}`, () => courseApi.get(courseId));
    const { data: topic } = useSWR(`get-topic-${topicId}`, () => topicApi.get(topicId));

    const [editing, edit] = useEdit();
    const [isSaving, setSave] = useState(false);

    const [resources, setResources] = useState();
    const description = useRef();

    if (!course || !topic) return <Loading />;

    const isInstructor = !loading && isAuthenticated && course.instructor._id === id;

    if (!resources) setResources(topic.coreResources);
    if (!description.current) description.current = topic.description || 'No description yet.';

    const saveTopic = async () => {
        try {
            const promises = [];

            if (topic.coreResources !== resources)
                promises.push(topicApi.setCoreResources(topic._id, resources));

            if (topic.description !== description.current)
                promises.push(topicApi.update(topic._id, { description: description.current }));

            setSave(true);
            await Promise.all(promises);
            setSave(false);
            edit(false);
        } catch (err) {
            if (err.errors) {
                const errors = err.errors;
                errors.forEach(e => dispatch(setAlert(e, 'danger')));
            }
            setSave(false);
            edit(false);
        }
    };

    const cancel = () => {
        edit(false);
        window.location.reload(false);
    };

    const icons = (
        <Fragment>
            <i className='fas fa-check-circle completed'></i>
            <i className='fab fa-youtube video'></i>
            <i className='fas fa-book-open text'></i>
            <i className='fas fa-clipboard-list test'></i>
        </Fragment>
    );

    return (
        <Fragment>
            <div className='main-content'>
                <h2>{topic.name}</h2>

                {isInstructor && !editing && <Button text='Edit' onClick={() => edit(true)} />}
                {isInstructor && editing && (
                    <Fragment>
                        <Button
                            text='Save Topic'
                            onClick={saveTopic}
                            loading={isSaving ? 'Saving' : null}
                        />
                        <Button text='Cancel' onClick={cancel} />
                    </Fragment>
                )}

                <h3>Description</h3>

                {editing ? (
                    <Editable
                        html={description.current}
                        tagName='p'
                        onChange={e => (description.current = e.target.value)}
                    />
                ) : (
                    <FadeText html>{description.current}</FadeText>
                )}
                <Tabs.Container>
                    <Tabs.Tab name='Topic content'>
                        <ul className='topic-content'>
                            {resources &&
                                resources.map((res, i) => (
                                    <Fragment key={i}>
                                        <li className={res.kind}>
                                            {editing && (
                                                <Delete
                                                    onDelete={() => {
                                                        setResources([
                                                            ...resources.slice(0, i),
                                                            ...resources.slice(i + 1)
                                                        ]);
                                                    }}
                                                />
                                            )}
                                            <Link to='#!'>
                                                {icons}
                                                <Editable
                                                    html={res.name}
                                                    tagName='span'
                                                    onChange={e => {
                                                        resources[i].name = e.target.value;
                                                    }}
                                                    disabled={!editing}
                                                />
                                            </Link>
                                        </li>
                                        {editing && (
                                            <li>
                                                <AddNew
                                                    onAdd={() => {
                                                        setResources([
                                                            ...resources.slice(0, i + 1),
                                                            {
                                                                kind: 'text',
                                                                name: 'new',
                                                                text: ' '
                                                            },
                                                            ...resources.slice(i + 1)
                                                        ]);
                                                    }}
                                                >
                                                    New Resource
                                                </AddNew>
                                            </li>
                                        )}
                                    </Fragment>
                                ))}
                        </ul>
                    </Tabs.Tab>
                    {!editing && (
                        <Tabs.Tab name='Resource dump'>
                            <Comments comments={topic.resourceDump} user={id} />
                        </Tabs.Tab>
                    )}
                    {!editing && (
                        <Tabs.Tab name='Doubts'>
                            <Comments comments={topic.doubt} user={id} />
                        </Tabs.Tab>
                    )}
                </Tabs.Container>
            </div>
        </Fragment>
    );
};

export default Topic;
