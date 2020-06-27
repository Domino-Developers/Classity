import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

import SideBar from '../layout/SideBar';
import Breadcrumb from '../layout/Breadcrumb';
import Editable from '../layout/Editable';
import Tabs from '../layout/Tabs';
import FadeText from '../layout/FadeText';

import './Topic.css';

const Topic = () => {
    const instructor = true;
    const [editing, edit] = useState(false);
    const [description, changeDescription] = useState(text);
    const [names, changeNames] = useState({
        resource1: 'Video Name 1',
        resource2: 'Video Name 2',
        resource3: 'Text Name 3',
        resource4: 'Test Name 4'
    });

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
            <Breadcrumb.Container
                instructor={instructor}
                edit={edit}
                editing={editing}
            >
                <Breadcrumb.Item>Hi</Breadcrumb.Item>
                <Breadcrumb.Item>Hello</Breadcrumb.Item>
            </Breadcrumb.Container>
            <div className='main-content-area'>
                <SideBar.Container>
                    <SideBar.Tab text='Topic1'>
                        <SideBar.Item>video1</SideBar.Item>
                        <SideBar.Item>video1</SideBar.Item>
                        <SideBar.Item>video1</SideBar.Item>
                        <SideBar.Item>video1</SideBar.Item>
                    </SideBar.Tab>
                    <SideBar.Tab text='Topic1'>
                        <SideBar.Item>video1</SideBar.Item>
                        <SideBar.Item>video1</SideBar.Item>
                        <SideBar.Item>video1</SideBar.Item>
                        <SideBar.Item>video1</SideBar.Item>
                    </SideBar.Tab>
                </SideBar.Container>
                <div className='main-content'>
                    <h2>Topic Name</h2>
                    <h3>Description</h3>
                    {editing ? (
                        <Editable
                            html={description}
                            tagName='p'
                            onChange={e => changeDescription(e.target.value)}
                        />
                    ) : (
                        <FadeText html>{description}</FadeText>
                    )}
                    <Tabs.Container>
                        <Tabs.Tab name='Topic content'>
                            <ul className='topic-content'>
                                <li className='video completed'>
                                    <Link to='#!'>
                                        {icons}
                                        <Editable
                                            html={names.resource1}
                                            tagName='span'
                                            onChange={e =>
                                                changeNames({
                                                    ...names,
                                                    resource1: e.target.value
                                                })
                                            }
                                            disabled={!editing}
                                        />
                                    </Link>
                                </li>
                                <li className='video'>
                                    <Link to='#!'>
                                        {icons}
                                        <Editable
                                            html={names.resource2}
                                            tagName='span'
                                            onChange={e =>
                                                changeNames({
                                                    ...names,
                                                    resource2: e.target.value
                                                })
                                            }
                                            disabled={!editing}
                                        />
                                    </Link>
                                </li>
                                <li className='text'>
                                    <Link to='#!'>
                                        {icons}
                                        <Editable
                                            html={names.resource3}
                                            tagName='span'
                                            onChange={e =>
                                                changeNames({
                                                    ...names,
                                                    resource3: e.target.value
                                                })
                                            }
                                            disabled={!editing}
                                        />
                                    </Link>
                                </li>
                                <li className='test'>
                                    <Link to='#!'>
                                        {icons}
                                        <Editable
                                            html={names.resource4}
                                            tagName='span'
                                            onChange={e =>
                                                changeNames({
                                                    ...names,
                                                    resource4: e.target.value
                                                })
                                            }
                                            disabled={!editing}
                                        />
                                    </Link>
                                </li>
                            </ul>
                        </Tabs.Tab>
                        {!editing && <Tabs.Tab name='Resource dump'></Tabs.Tab>}
                        {!editing && <Tabs.Tab name='Doubts'></Tabs.Tab>}
                    </Tabs.Container>
                </div>
            </div>
        </Fragment>
    );
};

export default Topic;

const text = `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Mollitia nulla odit vitae at vero quas alias. Ullam iste tenetur totam. Facere totam, provident dicta natus perferendis, mollitia ipsam voluptatum impedit sequi veritatis, ea possimus repudiandae suscipit cumque ipsum amet sint atque doloribus consectetur aspernatur beatae unde quod sapiente necessitatibus! Dolores illum saepe, enim corporis fugiat maiores qui facilis consequatur. Sint fuga non provident laborum ullam laudantium accusantium, eveniet labore modi sit sequi tempora blanditiis quam quasi quae consequatur itaque neque distinctio repellendus voluptatem deleniti? Aliquid perspiciatis at, dignissimos eos numquam, culpa provident molestiae quo consectetur iure placeat, blanditiis praesentium aspernatur?`;
