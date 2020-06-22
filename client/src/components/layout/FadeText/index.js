import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AnimateHeight from 'react-animate-height';

import './FadeText.css';

const FadeText = props => {
    const lines = props.lines || 4;
    const isHtml = props.html;
    const text = props.children;
    const showHeight = Number(lines) * 24;

    let element = {};
    const [hidden, hide] = useState(0);
    const [show, toggle] = useState(false);

    useEffect(() => {
        if (element.clientHeight > showHeight) hide(1);
    }, [element.clientHeight, showHeight]);

    const contracted = (
        <div className={'fade-text' + (show ? ' show' : '')}>
            <AnimateHeight height={show ? 'auto' : showHeight}>
                <div className='content'>
                    {isHtml ? (
                        <div dangerouslySetInnerHTML={{ __html: text }} />
                    ) : (
                        <div>{text}</div>
                    )}
                    <div
                        className='fade'
                        style={{ top: `${1.2 * (lines - 1)}rem` }}
                    ></div>
                </div>
            </AnimateHeight>
            <a href='#!' onClick={() => toggle(!show)}>
                {show ? (
                    <span>
                        <i className='fas fa-minus'></i>See less
                    </span>
                ) : (
                    <span>
                        <i className='fas fa-plus'></i>See more
                    </span>
                )}
            </a>
        </div>
    );

    const normal = isHtml ? (
        <div
            dangerouslySetInnerHTML={{ __html: text }}
            ref={e => (element = e)}
        />
    ) : (
        <div ref={e => (element = e)}>{text}</div>
    );

    return hidden ? contracted : normal;
};

FadeText.propTypes = {
    lines: PropTypes.string,
    html: PropTypes.bool
};

export default FadeText;
