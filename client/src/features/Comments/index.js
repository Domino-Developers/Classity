import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Comment from './Comment';
import NewComment from './NewComment';
import Button from '../../components/Button';

import './Comments.css';

const Comments = props => {
    const change = props.show || 5;
    const seeMore = props.seeMore || 'See more';

    const [toShow, show] = useState(change);

    const comments = props.comments.slice(0, toShow);

    return (
        <ul className='comments'>
            <li className='new-comment'>
                <NewComment
                    review={props.review}
                    comments={props.comments}
                    onAdd={props.onAdd}
                    user={props.user}
                    newText={props.newText}
                />
            </li>
            {comments.map((com, i) =>
                props.review ? (
                    <Comment key={i} review comment={com} />
                ) : (
                    <Comment key={i} comment={com} replies={com.reply} user={props.user} />
                )
            )}
            {toShow < props.comments.length && (
                <li className='more'>
                    <Button text={seeMore} onClick={() => show(toShow + change)} />
                </li>
            )}
        </ul>
    );
};

Comments.propTypes = {
    comments: PropTypes.array.isRequired,
    show: PropTypes.string,
    seeMore: PropTypes.string,
    newText: PropTypes.string,
    review: PropTypes.bool,
    onAdd: PropTypes.func.isRequired,
    user: PropTypes.string.isRequired
};

export default Comments;
