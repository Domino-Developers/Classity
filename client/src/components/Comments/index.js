import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Comment from './Comment';
import Button from '../Button';

import './Comments.css';

const Comments = props => {
    const change = props.show || 5;
    const seeMore = props.seeMore || 'See more';

    const [toShow, show] = useState(change);

    const comments = props.comments.slice(0, toShow);

    return (
        <ul className='comments'>
            {comments.map((e, i) =>
                props.review ? (
                    <Comment key={i} review />
                ) : (
                    <Comment key={i} replies={[1, 2, 3]} />
                )
            )}
            {toShow < props.comments.length && (
                <li className='more'>
                    <Button
                        text={seeMore}
                        onClick={() => show(toShow + change)}
                    />
                </li>
            )}
        </ul>
    );
};

Comments.propTypes = {
    comments: PropTypes.array.isRequired,
    show: PropTypes.string,
    seeMore: PropTypes.string,
    review: PropTypes.bool
};

export default Comments;
