import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import Topic from '../../features/Topic';
import Resource from '../../features/Resource';

const ContentContainer = () => {
    return (
        <Fragment>
            <Switch>
                <Route exact path='/course/:courseId/topic/:topicId' component={Topic} />
                <Route
                    exact
                    path='/course/:courseId/topic/:topicId/resource/:resourceId'
                    component={Resource}
                />
            </Switch>
        </Fragment>
    );
};

export default ContentContainer;
