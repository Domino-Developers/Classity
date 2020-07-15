import React from 'react';

import CircularProgress from '../CircularProgress';
import { useResourceStatus } from '../../utils/hooks';

const ProgressCircle = ({ course, instructor }) => {
    const resourcesDone = useResourceStatus(instructor, course._id);

    const totalResources = course.topics.reduce((tot, top) => tot + top.coreResources.length, 0);
    const progress = (resourcesDone.length / totalResources) * 100;
    return (
        <div className='topbar__right'>
            Your progress
            <CircularProgress size='50' progress={progress} />
        </div>
    );
};

export default ProgressCircle;
