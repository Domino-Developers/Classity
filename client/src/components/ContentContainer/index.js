import React, { Fragment, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Link } from 'react-router-dom';
import useSWR from 'swr';

import Topic from '../../features/Topic';
import Resource from '../../features/Resource';
import TopBar from '../TopBar';
import courseApi from '../../api/course';
import SideBar from '../SideBar';
import Loading from '../Loading';

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

const SideBarContainer = ({ params: { courseId } }) => {
    const { data: course } = useSWR(`get-course-${courseId}`, () => courseApi.get(courseId));

    if (!course) return <Loading />;

    return (
        <Fragment>
            <SideBar.Container>
                {course.topics.map((topic, i) => (
                    <SideBar.Tab
                        text={topic.name}
                        key={i}
                        to={`/course/${courseId}/topic/${topic._id}`}>
                        {topic.coreResources.map((res, i) => (
                            <SideBar.Item key={i}>
                                <Link
                                    className='sidebar__link'
                                    to={`/course/${courseId}/topic/${topic._id}/resource/${res._id}`}>
                                    {res.name}
                                </Link>
                            </SideBar.Item>
                        ))}
                    </SideBar.Tab>
                ))}
            </SideBar.Container>
        </Fragment>
    );
};

export default ContentContainer;
