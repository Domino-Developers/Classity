import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Collapse from '../../components/Collapse';

const Content = props => {
    const { editing, course, changeCourse } = props;
    const [topics, setTopics] = useState([...course.topics]);
    changeCourse('topics', topics);

    return (
        <section>
            <h2>Course Content</h2>
            <Collapse.Container editing={editing}>
                <Collapse.Head>
                    <Collapse.Item
                        onAdd={() => {
                            setTopics([{ name: 'New Topic', coreResources: [] }, ...topics]);
                            changeCourse('topics', topics);
                        }}
                    >
                        New Topic
                    </Collapse.Item>
                </Collapse.Head>
                {topics.map((topic, i) => (
                    <Collapse.Head
                        key={i}
                        text={topic.name}
                        to={`/course/${course._id}/topic/${topic._id}`}
                        onChange={e => {
                            setTopics([
                                ...topics.slice(0, i),
                                { ...topic, name: e.target.value },
                                ...topics.slice(i + 1)
                            ]);
                            changeCourse('topics', topics);
                        }}
                        onDelete={() => {
                            setTopics([...topics.slice(0, i), ...topics.slice(i + 1)]);
                            changeCourse('topics', topics);
                        }}
                    >
                        {topic.coreResources.map((res, i) => (
                            <Collapse.Item key={i}> {res.name} </Collapse.Item>
                        ))}
                        <Collapse.Item
                            onAdd={() => {
                                setTopics([
                                    ...topics.slice(0, i + 1),
                                    { name: 'New Topic', coreResources: [] },
                                    ...topics.slice(i + 1)
                                ]);
                                changeCourse('topics', topics);
                            }}
                        >
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
    course: PropTypes.object.isRequired
};

export default Content;
