import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AnimateHeight from 'react-animate-height';

import Editable from '../layout/Editable';
import AddNew from '../layout/AddNew';

const Content = props => {
    const { editing } = props;
    const [toShow, show] = useState('topic0');
    const [names, changeNames] = useState({
        topic1: 'Topic Name 1',
        topic2: 'Topic Name 2',
        topic3: 'Topic Name 3'
    });

    const toggleShow = e => {
        const current = document.getElementById(toShow);
        if (current) {
            current.classList.remove('show');
            current.classList.add('hide');
        }

        const parent = e.target.closest('li');
        if (parent.id !== toShow) {
            parent.classList.add('show');
            parent.classList.remove('hide');
            show(parent.id);
        } else {
            show('topic-0');
        }
    };

    return (
        <section>
            <h2>Course Content</h2>
            <ul className='course-topics'>
                {editing && (
                    <li>
                        <AddNew>
                            <i className='fas fa-plus'></i>Add new topic
                        </AddNew>
                    </li>
                )}
                <li className='hide' id='topic1'>
                    {editing ? (
                        <p>
                            <i className='fas fa-minus delete-btn'></i>
                            <Editable
                                text={names.topic1}
                                onChange={e =>
                                    changeNames({
                                        ...names,
                                        topic1: e.target.value
                                    })
                                }
                                disabled={!editing}
                                tagName='span'
                            />
                        </p>
                    ) : (
                        <p onClick={toggleShow}>
                            <i className='fas fa-plus show-button'></i>
                            <i className='fas fa-minus hide-button'></i>
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: names.topic1
                                }}
                            />
                        </p>
                    )}

                    <AnimateHeight
                        height={toShow === 'topic1' || editing ? 'auto' : 0}
                    >
                        <ul>
                            <li>
                                <p>Video 1</p>
                            </li>

                            <li>
                                <p>Video 2</p>
                            </li>

                            <li>
                                <p>Resource 1</p>
                            </li>

                            <li>
                                <p>Test 1</p>
                            </li>
                        </ul>
                    </AnimateHeight>
                    {editing && (
                        <AddNew>
                            <i className='fas fa-plus'></i>Add new topic
                        </AddNew>
                    )}
                </li>
                <li className='hide' id='topic2'>
                    {editing ? (
                        <p>
                            <i className='fas fa-minus delete-btn'></i>
                            <Editable
                                text={names.topic2}
                                onChange={e =>
                                    changeNames({
                                        ...names,
                                        topic2: e.target.value
                                    })
                                }
                                disabled={!editing}
                                tagName='span'
                            />
                        </p>
                    ) : (
                        <p onClick={toggleShow}>
                            <i className='fas fa-plus show-button'></i>
                            <i className='fas fa-minus hide-button'></i>
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: names.topic2
                                }}
                            />
                        </p>
                    )}

                    <AnimateHeight
                        height={toShow === 'topic2' || editing ? 'auto' : 0}
                    >
                        <ul>
                            <li>
                                <p>Video 1</p>
                            </li>

                            <li>
                                <p>Video 2</p>
                            </li>

                            <li>
                                <p>Resource 1</p>
                            </li>

                            <li>
                                <p>Test 1</p>
                            </li>
                        </ul>
                    </AnimateHeight>
                    {editing && (
                        <AddNew>
                            <i className='fas fa-plus'></i>Add new topic
                        </AddNew>
                    )}
                </li>
                <li className='hide' id='topic3'>
                    {editing ? (
                        <p>
                            <i className='fas fa-minus delete-btn'></i>
                            <Editable
                                text={names.topic3}
                                onChange={e =>
                                    changeNames({
                                        ...names,
                                        topic3: e.target.value
                                    })
                                }
                                disabled={!editing}
                                tagName='span'
                            />
                        </p>
                    ) : (
                        <p onClick={toggleShow}>
                            <i className='fas fa-plus show-button'></i>
                            <i className='fas fa-minus hide-button'></i>
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: names.topic3
                                }}
                            />
                        </p>
                    )}

                    <AnimateHeight
                        height={toShow === 'topic3' || editing ? 'auto' : 0}
                    >
                        <ul>
                            <li>
                                <p>Video 1</p>
                            </li>

                            <li>
                                <p>Video 2</p>
                            </li>

                            <li>
                                <p>Resource 1</p>
                            </li>

                            <li>
                                <p>Test 1</p>
                            </li>
                        </ul>
                    </AnimateHeight>
                    {editing && (
                        <AddNew>
                            <i className='fas fa-plus'></i>Add new topic
                        </AddNew>
                    )}
                </li>
            </ul>
        </section>
    );
};

Content.propTypes = {
    editing: PropTypes.bool.isRequired
};

export default Content;
