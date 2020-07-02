import React, { Fragment } from 'react';
import loadable from '@loadable/component';

const Moment = loadable.lib(() => import('moment'));

const FromNow = ({ date }) => {
    const dateShow = new Date(date);
    return (
        <Fragment>
            <Moment fallback={dateShow.toLocaleDateString()}>
                {({ default: moment }) => moment(date).fromNow()}
            </Moment>
        </Fragment>
    );
};

export default FromNow;
