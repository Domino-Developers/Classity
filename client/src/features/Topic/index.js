import React, { Fragment, useState } from 'react';
import { Link, useParams, Redirect } from 'react-router-dom';
import useSWR, { mutate } from 'swr';

import courseApi from '../../api/course';
import topicApi from '../../api/topic';

import SideBar from '../../components/SideBar';
import Breadcrumb from '../../components/Breadcrumb';
import Editable from '../../components/Editable';
import Tabs from '../../components/Tabs';
import FadeText from '../../components/FadeText';
import Loading from '../../components/Loading';
import Comments from '../Comments';

import './Topic.css';
import { useSelector } from 'react-redux';

const updateTopic = async (topic, description, resources) => {
    console.log('updating'); // This will be changed to overlay

    await Promise.all([
        topicApi.setCoreResources(topic._id, resources),
        topicApi.update(topic._id, { description })
    ]);

    mutate(`get-topic-${topic._id}`, {
        ...topic,
        coreResources: resources,
        description
    });
};

const Topic = () => {
    const { courseId, topicId } = useParams();
    const {
        isAuthenticated,
        loading,
        userData: { id }
    } = useSelector(state => state.auth);

    const { data: course } = useSWR(`get-course-${courseId}`, () =>
        courseApi.get(courseId)
    );
    const { data: topic } = useSWR(`get-topic-${topicId}`, () =>
        topicApi.get(topicId)
    );

    const [editing, edit] = useState(false);

    const isInstructor =
        !loading && isAuthenticated && course && course.instructor._id === id;
    const isStudent =
        !loading &&
        isAuthenticated &&
        course &&
        course.students.indexOf(id) !== -1;

    if (!loading && course && !isStudent && !isInstructor)
        return <Redirect to={`/course/${courseId}`} />;

    if (!course || !topic) return <Loading />;

    let description = topic.description || 'No description yet.';
    let resources = topic.coreResources;

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
                instructor={isInstructor}
                edit={edit}
                editing={editing}
                onSave={() => updateTopic(topic, description, resources)}
            >
                <Breadcrumb.Item>{course.name}</Breadcrumb.Item>
                <Breadcrumb.Item>{topic.name}</Breadcrumb.Item>
            </Breadcrumb.Container>
            <div className='main-content-area'>
                <SideBar.Container>
                    {course.topics.map((topic, i) => (
                        <SideBar.Tab text={topic.name} key={i}>
                            {topic.coreResources.map((res, i) => (
                                <SideBar.Item key={i}>{res.name}</SideBar.Item>
                            ))}
                        </SideBar.Tab>
                    ))}
                </SideBar.Container>
                <div className='main-content'>
                    <h2>{topic.name}</h2>
                    <h3>Description</h3>
                    {editing ? (
                        <Editable
                            html={description}
                            tagName='p'
                            onChange={e => (description = e.target.value)}
                        />
                    ) : (
                        <FadeText html>{description}</FadeText>
                    )}
                    <Tabs.Container>
                        <Tabs.Tab name='Topic content'>
                            <ul className='topic-content'>
                                {resources &&
                                    resources.map((res, i) => (
                                        <li className={res.kind} key={i}>
                                            <Link to='#!'>
                                                {icons}
                                                <Editable
                                                    html={res.name}
                                                    tagName='span'
                                                    onChange={e => {
                                                        resources[i].name =
                                                            e.target.value;
                                                    }}
                                                    disabled={!editing}
                                                />
                                            </Link>
                                        </li>
                                    ))}
                            </ul>
                        </Tabs.Tab>
                        {!editing && (
                            <Tabs.Tab name='Resource dump'>
                                <Comments
                                    comments={topic.resourceDump}
                                    user={id}
                                />
                            </Tabs.Tab>
                        )}
                        {!editing && (
                            <Tabs.Tab name='Doubts'>
                                <Comments comments={topic.doubt} user={id} />
                            </Tabs.Tab>
                        )}
                    </Tabs.Container>
                </div>
            </div>
        </Fragment>
    );
};

export default Topic;
