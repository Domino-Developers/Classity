import React from 'react';
import PropTypes from 'prop-types';

import CircularProgress from '../CircularProgress';
import { useResourceStatus } from '../../utils/hooks';

const ProgressCircle = ({ course }) => {
    const resourcesDoneByTopic = useResourceStatus(true, course._id);
    const resourcesDone = [];
    Object.values(resourcesDoneByTopic).forEach(res => {
        resourcesDone.push(...res);
    });
    const totalResources = course.topics.reduce((tot, top) => tot + top.coreResources.length, 0);
    const progress = (resourcesDone.length / totalResources) * 100;
    return (
        <div className='topbar__right'>
            Your progress
            <CircularProgress size='50' progress={progress || 0} />
        </div>
    );
};

ProgressCircle.propTypes = {
    course: PropTypes.object.isRequired
};

export default ProgressCircle;
