import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Collapse from '../../components/Collapse';

const Content = props => {
    const { editing, course } = props;
    const [names, changeNames] = useState([...course.topics.map(topic => topic.name)]);

    return (
        <section>
            <h2>Course Content</h2>
            <Collapse.Container editing={editing}>
                {names.map((topic, i) => (
                    <Collapse.Head
                        key={i}
                        text={topic}
                        onChange={e => {
                            names.splice(i, 1, e.target.value);
                            changeNames(names);
                        }}>
                        {course.topics[i].coreResources.map((res, i) => (
                            <Collapse.Item key={i}> {res.name} </Collapse.Item>
                        ))}
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
