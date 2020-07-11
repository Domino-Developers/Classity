import React, { Fragment, useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { useSelector, useDispatch } from 'react-redux';

import courseApi from '../../api/course';
import topicApi from '../../api/topic';
import commentApi from '../../api/comment';

import Editable from '../../components/Editable';
import Tabs from '../../components/Tabs';
import FadeText from '../../components/FadeText';
import Loading from '../../components/Loading';
import Comments from '../Comments';
import AddNew from '../../components/AddNew';
import Button from '../../components/Button';
import Html from '../../components/Html';
import { useEdit } from '../../utils/hooks';
import { setAlert } from '../Alerts/alertSlice';

const Topic = () => {
    const dispatch = useDispatch();
    const { courseId, topicId } = useParams();
    const { isAuthenticated, loading: loading1 } = useSelector(state => state.auth);
    const { _id: id, loading: loading2 } = useSelector(state => state.user);
    const { data: course } = useSWR(`get-course-${courseId}`, () => courseApi.get(courseId));
    const { data: topic, mutate } = useSWR(`get-topic-${topicId}`, () => topicApi.get(topicId));

    const [editing, edit] = useEdit();
    const [isSaving, setSave] = useState(false);

    const [resources, setResources] = useState();
    const description = useRef();

    useEffect(() => {
        if (topic) setResources([...topic.coreResources]);
    }, [topic]);

    const loading = loading1 || loading2;

    if (!course || !topic) return <Loading />;

    const isInstructor = !loading && isAuthenticated && course.instructor._id === id;

    if (editing && !isInstructor) edit(false);

    if (!resources) setResources([...topic.coreResources]);
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
            await mutate();
            setSave(false);
            edit(false);
        } catch (err) {
            if (err.errors) {
                const errors = err.errors;
                errors.forEach(e => dispatch(setAlert(e.msg, 'danger')));
            }
            setSave(false);
            edit(false);
        }
    };

    const cancel = () => {
        edit(false);
        window.location.reload(false);
    };

    const addComment = async (type, comment, clear) => {
        try {
            await commentApi.add(topic._id, type, comment);

            mutate({
                ...topic,
                [type]: [
                    ...topic[type],
                    {
                        text: comment.text,
                        user: id,
                        likes: [],
                        reply: [],
                        date: Date.now()
                    }
                ]
            });

            clear();
        } catch (err) {
            if (err.errors) {
                const errors = err.errors;
                errors.forEach(e => dispatch(setAlert(e.msg, 'danger')));
            }
        }
    };

    const icons = (
        <Fragment>
            <i className='fas fa-check-circle topic-content__icon topic-content__icon--completed'></i>
            <i className='fab fa-youtube topic-content__icon topic-content__icon--video'></i>
            <i className='fas fa-book-open topic-content__icon topic-content__icon--text'></i>
            <i className='fas fa-clipboard-list topic-content__icon topic-content__icon--test'></i>
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
                            {editing && (
                                <li>
                                    <AddNew>
                                        <span
                                            onAdd={() => {
                                                setResources([
                                                    {
                                                        kind: 'text',
                                                        name: 'new',
                                                        payload: ' '
                                                    },
                                                    ...resources
                                                ]);
                                            }}>
                                            New Text
                                        </span>
                                        <span
                                            onAdd={() => {
                                                setResources([
                                                    {
                                                        kind: 'video',
                                                        name: 'new',
                                                        payload:
                                                            'https://www.youtube.com/watch?v=I7CfaDYzTVM'
                                                    },
                                                    ...resources
                                                ]);
                                            }}>
                                            New Video
                                        </span>
                                        <span
                                            onAdd={() => {
                                                setResources([
                                                    {
                                                        kind: 'test',
                                                        name: 'new',
                                                        payload: ' '
                                                    },
                                                    ...resources
                                                ]);
                                            }}>
                                            New Test
                                        </span>
                                    </AddNew>
                                </li>
                            )}
                            {resources &&
                                resources.map((res, i) => (
                                    <Fragment key={i}>
                                        <li
                                            className={`topic-content__item topic-content__item--${res.kind}`}>
                                            {editing && (
                                                <i
                                                    className='fas fa-minus delete-btn'
                                                    onClick={() => {
                                                        setResources([
                                                            ...resources.slice(0, i),
                                                            ...resources.slice(i + 1)
                                                        ]);
                                                    }}></i>
                                            )}
                                            {editing ? (
                                                <Editable
                                                    html={res.name}
                                                    className={`topic-content__link topic-content__link--edit topic-content__${res.kind}`}
                                                    tagName='span'
                                                    onChange={e => {
                                                        resources[i].name = e.target.value;
                                                    }}
                                                    disabled={!editing}
                                                />
                                            ) : (
                                                <Link
                                                    to={`/course/${course._id}/topic/${topic._id}/resource/${res._id}`}
                                                    className='topic-content__link'>
                                                    {icons}
                                                    <Html
                                                        tag='span'
                                                        className={`topic-content__${res.kind}`}>
                                                        {res.name}
                                                    </Html>
                                                </Link>
                                            )}
                                        </li>
                                        {editing && (
                                            <li>
                                                <AddNew>
                                                    <span
                                                        onAdd={() => {
                                                            setResources([
                                                                ...resources.slice(0, i + 1),
                                                                {
                                                                    kind: 'text',
                                                                    name: 'new',
                                                                    payload: ' '
                                                                },
                                                                ...resources.slice(i + 1)
                                                            ]);
                                                        }}>
                                                        New Text
                                                    </span>
                                                    <span
                                                        onAdd={() => {
                                                            setResources([
                                                                ...resources.slice(0, i + 1),
                                                                {
                                                                    kind: 'video',
                                                                    name: 'new',
                                                                    payload:
                                                                        'https://www.youtube.com/watch?v=I7CfaDYzTVM'
                                                                },
                                                                ...resources.slice(i + 1)
                                                            ]);
                                                        }}>
                                                        New Video
                                                    </span>
                                                    <span
                                                        onAdd={() => {
                                                            setResources([
                                                                ...resources.slice(0, i + 1),
                                                                {
                                                                    kind: 'test',
                                                                    name: 'new',
                                                                    payload: ' '
                                                                },
                                                                ...resources.slice(i + 1)
                                                            ]);
                                                        }}>
                                                        New Test
                                                    </span>
                                                </AddNew>
                                            </li>
                                        )}
                                    </Fragment>
                                ))}
                        </ul>
                    </Tabs.Tab>
                    {!editing && (
                        <Tabs.Tab name='Resource dump'>
                            <Comments
                                comments={topic.resourceDump}
                                user={id}
                                newText='Share a resource'
                                onAdd={(comment, clear) =>
                                    addComment('resourceDump', comment, clear)
                                }
                            />
                        </Tabs.Tab>
                    )}
                    {!editing && (
                        <Tabs.Tab name='Doubts'>
                            <Comments
                                comments={topic.doubt}
                                user={id}
                                newText='Ask a doubt'
                                onAdd={(comment, clear) => addComment('doubt', comment, clear)}
                            />
                        </Tabs.Tab>
                    )}
                </Tabs.Container>
            </div>
        </Fragment>
    );
};

export default Topic;
