import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import './CircularProgress.css';

const CircularProgress = props => {
    const { size, progress } = props;
    const strokeWidth = 2;
    const center = size / 2;
    const radius = center - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
    const style = getComputedStyle(document.body);

    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const progressOffset = ((100 - progress) / 100) * circumference;
        setOffset(progressOffset);
    }, [setOffset, circumference, progress, offset]);

    return (
        <svg className='progress-svg' width={size} height={size}>
            <circle
                stroke={style.getPropertyValue('--grey-color')}
                cx={center}
                cy={center}
                r={radius}
                strokeWidth={strokeWidth}
            />
            <circle
                stroke={style.getPropertyValue('--primary-color')}
                cx={center}
                cy={center}
                r={radius}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
            />
            <text x={center} y={center}>
                {progress}%
            </text>
        </svg>
    );
};

CircularProgress.propTypes = {
    size: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired
};

export default CircularProgress;
