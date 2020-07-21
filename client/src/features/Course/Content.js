import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import Collapse from '../../components/Collapse';
import Loading from '../../components/Loading';
import courseStore from '../../api/course';
import { setAlert } from '../Alerts/alertSlice';

const Content = props => {
    const dispatch = useDispatch();

    const { editing, course, courseChanges } = props;
    const [topics, setTopics] = useState([...course.topics]);
    courseChanges.current.topics = topics;

    useEffect(() => {
        setTopics([...course.topics]);
    }, [course.topics]);

    const resourcesDoneByTopic = course.courseProgress && course.courseProgress.topicStatus;
    const resourceDone = {};
    for (const topic in resourcesDoneByTopic) {
        resourcesDoneByTopic[topic].forEach(res => (resourceDone[res] = true));
    }

    const checkDeadline = useRef(course.courseProgress ? true : false);
    let completeBy = new Date(course.courseProgress && course.courseProgress.startedOn);
    const todayDate = Date.now();
    const [reset, setReset] = useState(false);
    const [resetting, setResetting] = useState(false);

    const resetDeadline = async () => {
        try {
            setResetting(true);
            await courseStore.resetDeadline(course._id);
            checkDeadline.current = false;
            setReset(false);
            setResetting(false);
        } catch (err) {
            if (err.errors) {
                const errors = err.errors;
                errors.forEach(e => dispatch(setAlert(e.msg, 'danger')));
            }
            setResetting(false);
        }
    };

    return (
        <section>
            <h2>Course Content</h2>
            {reset && !resetting && (
                <div className='course-content__reset'>
                    <p className='u-center-text'>
                        You missed your deadlines. Don't worry, you can reset them if you want.
                    </p>
                    <a href='#!' className='course-content__reset--link' onClick={resetDeadline}>
                        Reset Deadlines
                    </a>
                </div>
            )}
            {resetting && <Loading />}
            <Collapse.Container editing={editing}>
                <Collapse.Head>
                    <Collapse.Item
                        onAdd={() => {
                            setTopics([{ name: 'New Topic', coreResources: [] }, ...topics]);
                            courseChanges.current.topics = topics;
                        }}>
                        New Topic
                    </Collapse.Item>
                </Collapse.Head>
                {topics.map((topic, i) => {
                    let missedIcon = '';
                    if (checkDeadline.current) {
                        completeBy.setTime(
                            completeBy.getTime() + topic.deadline * 24 * 60 * 60 * 1000
                        );

                        if (completeBy < todayDate)
                            missedIcon =
                                '<i class="fas fa-exclamation-circle course-content__expire-icon"></i>';
                        if (completeBy < todayDate && !reset) setReset(true);
                    }

                    return (
                        <Collapse.Head
                            key={i}
                            text={
                                topic.name +
                                (course.courseProgress &&
                                resourcesDoneByTopic[topic._id] &&
                                resourcesDoneByTopic[topic._id].length ===
                                    topic.coreResources.length
                                    ? '<i class="fas fa-check-circle course-content__complete-icon"></i>'
                                    : missedIcon)
                            }
                            to={`/course/${course._id}/topic/${topic._id}`}
                            onChange={e => {
                                setTopics([
                                    ...topics.slice(0, i),
                                    { ...topic, name: e.target.value },
                                    ...topics.slice(i + 1)
                                ]);
                                courseChanges.current.topics = topics;
                            }}
                            onDelete={() => {
                                setTopics([...topics.slice(0, i), ...topics.slice(i + 1)]);
                                courseChanges.current.topics = topics;
                            }}>
                            {topic.coreResources.map((res, i) => (
                                <Collapse.Item
                                    key={i}
                                    to={
                                        !editing &&
                                        `/course/${course._id}/topic/${topic._id}/resource/${res._id}`
                                    }
                                    className={`icon course-content__icon--${
                                        resourceDone[res._id] ? 'completed' : res.kind
                                    }`}>
                                    {res.name}
                                </Collapse.Item>
                            ))}
                            <Collapse.Item
                                onAdd={() => {
                                    setTopics([
                                        ...topics.slice(0, i + 1),
                                        { name: 'New Topic', coreResources: [] },
                                        ...topics.slice(i + 1)
                                    ]);
                                    courseChanges.current.topics = topics;
                                }}>
                                New Topic
                            </Collapse.Item>
                        </Collapse.Head>
                    );
                })}
            </Collapse.Container>
        </section>
    );
};

Content.propTypes = {
    editing: PropTypes.bool.isRequired,
    course: PropTypes.object.isRequired,
    courseChanges: PropTypes.object.isRequired,
    isInstructor: PropTypes.bool.isRequired
};

export default Content;
