import React, { Fragment, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import useSWR from 'swr';
import { createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

import Topic from '../../features/Topic';
import Resource from '../../features/Resource';
import TopBar from '../TopBar';
import courseApi from '../../api/course';
import SideBar from '../SideBar';
import Loading from '../Loading';
import { useResourceStatus } from '../../utils/hooks';

const ContentContainer = props => {
    const [exist, setExist] = useState(true);

    return exist ? (
        <Fragment>
            <TopBar params={props.match.params} setExist={setExist} />
            <div className='main-content-area'>
                <SideBarContainer params={props.match.params} />
                <Switch>
                    <Route exact path='/course/:courseId/topic/:topicId' component={Topic} />
                    <Route
                        exact
                        path={`/course/:courseId/topic/:topicId/resource/:resourceId`}
                        component={Resource}
                    />
                </Switch>
            </div>
        </Fragment>
    ) : (
        <h1>Oops</h1>
    );
};

const sel = createSelector(
    state => state.user._id,
    id => id
);

const SideBarContainer = ({ params: { courseId } }) => {
    const { data: course } = useSWR(`get-course-${courseId}`, () => courseApi.get(courseId));
    const id = useSelector(sel);

    const resourcesDoneByTopic = useResourceStatus(
        course && course.students.includes(id),
        courseId
    );

    if (!course) return <Loading />;

    const resourceDone = {};
    for (const topic in resourcesDoneByTopic) {
        resourcesDoneByTopic[topic].forEach(res => (resourceDone[res] = true));
    }

    return (
        <Fragment>
            <SideBar.Container>
                {course.topics.map((topic, i) => (
                    <SideBar.Tab
                        text={
                            topic.name +
                            (resourcesDoneByTopic[topic._id] &&
                            resourcesDoneByTopic[topic._id].length === topic.coreResources.length
                                ? '<i class="fas fa-check-circle sidebar__complete-icon"></i>'
                                : '')
                        }
                        key={i}
                        to={`/course/${courseId}/topic/${topic._id}`}>
                        {topic.coreResources.map((res, i) => (
                            <SideBar.Item
                                key={i}
                                to={`/course/${courseId}/topic/${topic._id}/resource/${res._id}`}
                                className={`icon sidebar__icon--${
                                    resourceDone[res._id] ? 'completed' : res.kind
                                }`}>
                                {res.name}
                            </SideBar.Item>
                        ))}
                    </SideBar.Tab>
                ))}
            </SideBar.Container>
        </Fragment>
    );
};

export default ContentContainer;
