import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import Topic from '../../features/Topic';
import Resource from '../../features/Resource';
import TopBar from '../TopBar';
import useSWR from 'swr';
import courseApi from '../../api/course';
import SideBar from '../SideBar';
import Loading from '../Loading';

const ContentContainer = props => {
    return (
        <Fragment>
            <TopBar params={props.match.params} />
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
    );
};

const SideBarContainer = ({ params: { courseId } }) => {
    const { data: course, error } = useSWR(`get-course-${courseId}`, () => courseApi.get(courseId));

    if (!course) return <Loading />;
    if (error && navigator.onLine) return <div>Opps </div>;

    return (
        <Fragment>
            <SideBar.Container>
                {course.topics.map((topic, i) => (
                    <SideBar.Tab text={topic.name} key={i}>
                        {topic.coreResources.map((res, i) => (
                            <SideBar.Item key={i}>{res.name}</SideBar.Item>
                        ))}
                    </SideBar.Tab>
                ))}
            </SideBar.Container>
        </Fragment>
    );
};

export default ContentContainer;
