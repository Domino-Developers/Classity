import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Collapse from '../../components/Collapse';
import { useResourceStatus } from '../../utils/hooks';

const Content = props => {
    const { editing, course, courseChanges, isStudent, isInstructor } = props;
    const [topics, setTopics] = useState([...course.topics]);
    courseChanges.current.topics = topics;
    const resourcesDoneByTopic = useResourceStatus(isStudent, course._id);
    useEffect(() => {
        setTopics([...course.topics]);
    }, [course.topics]);

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
                                    (isStudent || isInstructor) &&
                                    `/course/${course._id}/topic/${topic._id}/resource/${res._id}`
                                }>
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
    isStudent: PropTypes.bool.isRequired,
    isInstructor: PropTypes.bool.isRequired
};

export default Content;
