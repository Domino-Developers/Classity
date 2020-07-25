import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Loading = props => {
    const sizeInRem = props.size || '5';
    const size = sizeInRem * parseFloat(getComputedStyle(document.documentElement).fontSize);
    const strokeWidth = sizeInRem <= 3 ? 2 : 4;
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
                className={'loading__circle' + (props.white ? ' loading__circle--white' : '')}
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
    white: PropTypes.bool,
    inline: PropTypes.bool
};

export default Loading;
