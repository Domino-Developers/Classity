import React, { Fragment, useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { useSelector, useDispatch } from 'react-redux';

import topicApi from '../../api/topic';
import courseApi from '../../api/course';
import commentApi from '../../api/comment';
import testApi from '../../api/test';

import Editable from '../../components/Editable';
import stripHtml from '../../utils/stripHtml';
import Tabs from '../../components/Tabs';
import FadeText from '../../components/FadeText';
import Loading from '../../components/Loading';
import Comments from '../Comments';
import AddNew from '../../components/AddNew';
import Button from '../../components/Button';
import { useEdit, useResourceStatus } from '../../utils/hooks';
import { setAlert } from '../Alerts/alertSlice';
import { createSelector } from '@reduxjs/toolkit';

const userAndAuth = createSelector(
    [
        state => state.user._id,
        state => state.user.name,
        state => state.user.loading,
        state => state.user.coursesCreated
    ],
    (id, name, loading, coursesCreated) => ({
        id,
        name,
        loading,
        coursesCreated
    })
);

const Topic = () => {
    const dispatch = useDispatch();
    const { courseId, topicId } = useParams();
    const { id, name, loading, coursesCreated } = useSelector(userAndAuth);
    const isInstructor = coursesCreated.includes(courseId);

    const { data: topic, mutate } = useSWR(`get-topic-${topicId}`, () => topicApi.get(topicId));
    const { data: course } = useSWR(isInstructor ? null : `get-course-${courseId}`, () =>
        courseApi.get(courseId)
    );

    const [editing, edit] = useEdit();
    const [isSaving, setSave] = useState(false);

    const [resources, setResources] = useState();
    const description = useRef();
    const deadline = useRef();

    useEffect(() => {
        if (topic) setResources([...topic.coreResources]);
    }, [topic]);

    const resourcesDone = useResourceStatus(!isInstructor, courseId, topicId);
    const isCompleted = {};
    if (resources) {
        resourcesDone.forEach(id => {
            isCompleted[id] = true;
        });
    }

    if ((!course && !isInstructor) || !topic || loading) return <Loading />;

    if (editing && !isInstructor) edit(false);

    if (!resources) setResources([...topic.coreResources]);
    if (!description.current) description.current = topic.description || 'No description yet.';
    if (!deadline.current) deadline.current = topic.deadline;

    let completeBy = new Date(course && course.courseProgress.startedOn);
    if (course)
        for (let i = 0; i < course.topics.length; i++) {
            completeBy.setTime(
                completeBy.getTime() + course.topics[i].deadline * 24 * 60 * 60 * 1000
            );
            if (course.topics[i]._id === topicId) break;
        }

    const saveTopic = async () => {
        try {
            if (deadline.current <= 0 || !Number.isInteger(deadline.current)) {
                dispatch(setAlert('Enter valid deadline', 'danger'));
                return;
            }

            resources.forEach(resource => (resource.name = stripHtml(resource.name)));

            const emptyResources = resources.filter(resource => resource.name === '');
            if (emptyResources.length) {
                dispatch(setAlert("Resource name can't be empty", 'danger'));
                return;
            }

            const promises = [];

            for (let i = 0; i < resources.length; i++) {
                if (!resources[i].payload) {
                    if (resources[i].kind === 'text')
                        resources[i].payload = 'Enter your reading material here.';
                    if (resources[i].kind === 'video')
                        resources[i].payload = 'https://www.youtube.com/watch?v=jNQXAC9IVRw';
                    if (resources[i].kind === 'test') {
                        const testId = await testApi.add(topic._id, {
                            questions: [
                                {
                                    kind: 'short',
                                    question: 'This is a sample question.',
                                    answer: 'answer here'
                                }
                            ],
                            passScore: 70
                        });
                        resources[i].payload = testId;
                    }
                }
            }

            if (topic.coreResources !== resources)
                promises.push(topicApi.setCoreResources(topic._id, resources));

            if (topic.description !== description.current || topic.deadline !== deadline.current)
                promises.push(
                    topicApi.update(topic._id, {
                        description: description.current,
                        deadline: deadline.current
                    })
                );

            setSave(true);
            await Promise.all(promises);
            await mutate();
            setSave(false);
            edit(false);
        } catch (err) {
            if (err.errors) {
                console.error(err);
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

    const addComment = async (e, type, comment, clear) => {
        e.preventDefault();

        try {
            mutate(
                {
                    ...topic,
                    [type]: [
                        ...topic[type],
                        {
                            text: comment.text,
                            user: { id, name },
                            likes: [],
                            reply: [],
                            date: Date.now()
                        }
                    ]
                },
                false
            );

            await commentApi.add(topic._id, type, comment);

            clear();
        } catch (err) {
            if (err.errors) {
                const errors = err.errors;
                errors.forEach(e => dispatch(setAlert(e.msg, 'danger')));
            }
        }
    };

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
                            className='u-margin-right-small'
                        />
                        <Button text='Cancel' onClick={cancel} />
                    </Fragment>
                )}
                <div className='u-margin-top-small u-margin-bottom-medium'>
                    {isInstructor ? (
                        <Fragment>
                            Deadline:&nbsp;
                            {editing ? (
                                <input
                                    type='text'
                                    defaultValue={deadline.current}
                                    onChange={e => (deadline.current = Number(e.target.value))}
                                    className='topic__deadline-input input'
                                />
                            ) : (
                                topic.deadline
                            )}
                            &nbsp;days
                        </Fragment>
                    ) : (
                        <Fragment>Complete the topic by {completeBy.toDateString()}</Fragment>
                    )}
                </div>

                <h3>Description</h3>

                {editing ? (
                    <Editable
                        html={description.current}
                        tagName='p'
                        onChange={e => (description.current = e.target.value)}
                        rich
                    />
                ) : (
                    <FadeText html>{description.current}</FadeText>
                )}
                <Tabs.Container>
                    <Tabs.Tab name='Topic content'>
                        <ul className='topic-content'>
                            {editing && (
                                <li>
                                    <AddNew guide={!(resources && resources.length)}>
                                        <span
                                            onAdd={() => {
                                                setResources([
                                                    { kind: 'text', name: 'New Text' },
                                                    ...resources
                                                ]);
                                            }}>
                                            New Text
                                        </span>
                                        <span
                                            onAdd={() => {
                                                setResources([
                                                    { kind: 'video', name: 'New Video' },
                                                    ...resources
                                                ]);
                                            }}>
                                            New Video
                                        </span>
                                        <span
                                            onAdd={() => {
                                                setResources([
                                                    { kind: 'test', name: 'New Test' },
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
                                        <li className='icon topic-content__item'>
                                            {editing && (
                                                <i
                                                    className='fas fa-minus delete-btn u-margin-right-small'
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
                                                    to={`/course/${topic.course}/topic/${topic._id}/resource/${res._id}`}
                                                    className='topic-content__link'>
                                                    <span
                                                        className={`icon topic-content__icon--${
                                                            isCompleted[res._id]
                                                                ? 'completed'
                                                                : res.kind
                                                        }`}>
                                                        <span
                                                            className={`topic-content__${res.kind}`}>
                                                            {res.name}
                                                        </span>
                                                    </span>
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
                                                                { kind: 'text', name: 'New Text' },
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
                                                                    name: 'New Video'
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
                                                                { kind: 'test', name: 'New Test' },
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
                                user={{ id, name }}
                                newText='Share a resource'
                                onAdd={(e, comment, clear) =>
                                    addComment(e, 'resourceDump', comment, clear)
                                }
                                newComment={
                                    isInstructor && 'To share something, add it to Topic content'
                                }
                            />
                        </Tabs.Tab>
                    )}
                    {!editing && (
                        <Tabs.Tab name='Doubts'>
                            <Comments
                                comments={topic.doubt}
                                user={{ id, name }}
                                newText='Ask a doubt'
                                onAdd={(e, comment, clear) =>
                                    addComment(e, 'doubt', comment, clear)
                                }
                                newComment={isInstructor && "Instructor can't ask a doubt"}
                            />
                        </Tabs.Tab>
                    )}
                </Tabs.Container>
            </div>
        </Fragment>
    );
};

export default Topic;
