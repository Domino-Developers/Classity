import React, { useState } from 'react';
import AnimateHeight from 'react-animate-height';
import PropTypes from 'prop-types';

import FadeText from '../../components/FadeText';
import Rating from '../../components/Rating';
import FromNow from '../../components/FromNow';

import commentApi from '../../api/comment';

const toggleLike = async (user, comment) => {
    const likeIndex = comment.likes.indexOf(user);

    if (likeIndex === -1) {
        await commentApi.like(comment._id);
    } else {
        await commentApi.unlike(comment._id);
    }
};

const Comment = props => {
    const { review, reply, replies, comment, user } = props;

    const [showReply, replyState] = useState(false);
    const [text, changeText] = useState('');

    const className = review ? 'is-review' : reply ? 'is-reply' : '';
    const liked = comment.likes && comment.likes.indexOf(user) !== -1;

    return (
        <li className={className}>
            <div className='comment'>
                <p className='date'>
                    <FromNow date={comment.date} />
                </p>
                <div className='rating'>
                    <Rating rating={comment.rating || 0} />
                </div>
                <div className='like'>
                    <span
                        className={liked ? 'icon active' : 'icon'}
                        onClick={() => toggleLike(user, comment)}
                    >
                        <i className='far fa-thumbs-up outline'></i>
                        <i className='fas fa-thumbs-up filled'></i>
                    </span>
                    <p>{comment.likes && comment.likes.length}</p>
                </div>
                <div className='reply'>
                    <span
                        className={showReply ? 'icon active' : 'icon'}
                        onClick={() => replyState(!showReply)}
                    >
                        <i className='far fa-comment-dots outline'></i>
                        <i className='fas fa-comment-dots filled'></i>
                    </span>
                    <p>{comment.reply && comment.reply.length}</p>
                </div>
                <p className='name'>Sanchit Arora</p>
                <div className='text'>
                    <FadeText>{comment.text}</FadeText>
                </div>
                <div className='add'>
                    <input
                        type='text'
                        placeholder='Enter your comment'
                        onChange={e => changeText(e.target.value)}
                    />
                    <a href='#!' className={text ? 'active' : ''}>
                        Submit
                    </a>
                </div>
            </div>
            {!reply && !review && (
                <AnimateHeight height={showReply ? 'auto' : 0}>
                    <h4>Replies</h4>
                    <ul>
                        {replies.map((r, i) => (
                            <Comment reply comment={r} key={i} />
                        ))}
                    </ul>
                </AnimateHeight>
            )}
        </li>
    );
};

Comment.propTypes = {
    rating: PropTypes.bool,
    reply: PropTypes.bool,
    replies: PropTypes.array,
    comment: PropTypes.object.isRequired,
    user: PropTypes.string
};

export default Comment;
