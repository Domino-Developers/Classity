import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Collapse from '../../components/Collapse';

const Content = props => {
    const { editing } = props;
    const [names, changeNames] = useState({
        topic1: 'Topic Name 1',
        topic2: 'Topic Name 2',
        topic3: 'Topic Name 3'
    });

    return (
        <section>
            <h2>Course Content</h2>
            <Collapse.Container editing={editing}>
                <Collapse.Head>
                    <Collapse.Item add>add</Collapse.Item>
                </Collapse.Head>
                <Collapse.Head
                    text={names.topic1}
                    onChange={e =>
                        changeNames({
                            ...names,
                            topic1: e.target.value
                        })
                    }
                >
                    <Collapse.Item>Video 1</Collapse.Item>
                    <Collapse.Item add>add me</Collapse.Item>
                </Collapse.Head>
                <Collapse.Head
                    text={names.topic2}
                    onChange={e =>
                        changeNames({
                            ...names,
                            topic2: e.target.value
                        })
                    }
                >
                    <Collapse.Item>Video 2</Collapse.Item>
                </Collapse.Head>
            </Collapse.Container>
        </section>
    );
};

Content.propTypes = {
    editing: PropTypes.bool.isRequired
};

export default Content;
