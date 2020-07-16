import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Loading = props => {
    const sizeInRem = props.size || '5';
    const size = sizeInRem * parseFloat(getComputedStyle(document.documentElement).fontSize);
    const strokeWidth = 2;
    const center = size / 2;
    const radius = center - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;

    const [offset, setOffset] = useState(50);

    useEffect(() => {
        const interval = setInterval(() => setOffset(offset - circumference / 20), 25);

        return () => clearInterval(interval);
    }, [offset, circumference]);

    return (
        <svg
            className={
                'loading ' +
                (props.inline ? 'loading--inline ' : '') +
                (props.className ? props.className : '')
            }
            width={size}
            height={size}>
            <circle
                className='loading__circle loading__circle--inner'
                cx={center}
                cy={center}
                r={radius}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
            />
        </svg>
    );
};

Loading.propTypes = {
    size: PropTypes.string,
    className: PropTypes.string,
    inline: PropTypes.bool
};

export default Loading;
