import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const CircularProgress = props => {
    const { size, progress } = props;
    const strokeWidth = 2;
    const center = size / 2;
    const radius = center - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;

    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const progressOffset = ((100 - progress) / 100) * circumference;
        setOffset(progressOffset);
    }, [setOffset, circumference, progress, offset]);

    return (
        <svg className='circular-progress' width={size} height={size}>
            <circle
                className='circular-progress__circle circular-progress__circle--outer'
                cx={center}
                cy={center}
                r={radius}
                strokeWidth={strokeWidth}
            />
            <circle
                className='circular-progress__circle circular-progress__circle--inner'
                cx={center}
                cy={center}
                r={radius}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
            />
            <text className='circular-progress__text' x={center} y={center}>
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
