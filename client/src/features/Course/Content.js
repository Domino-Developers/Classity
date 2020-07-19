import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Collapse from '../../components/Collapse';

const Content = props => {
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

    return (
        <section>
            <h2>Course Content</h2>
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
                {topics.map((topic, i) => (
                    <Collapse.Head
                        key={i}
                        text={
                            topic.name +
                            (resourcesDoneByTopic[topic._id] &&
                            resourcesDoneByTopic[topic._id].length === topic.coreResources.length
                                ? '<i class="fas fa-check-circle course-content__complete-icon"></i>'
                                : '')
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
                ))}
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
