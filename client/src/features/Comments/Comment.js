import React, { useState } from 'react';
import AnimateHeight from 'react-animate-height';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import useSWR from 'swr';

import FadeText from '../../components/FadeText';
import Rating from '../../components/Rating';
import FromNow from '../../components/FromNow';
import Loading from '../../components/Loading';
import { setAlert } from '../Alerts/alertSlice';

import commentApi from '../../api/comment';
import topicApi from '../../api/topic';

const Comment = props => {
    const dispatch = useDispatch();

    const { review, reply, replies, comment, user } = props;

    const { data: topic, mutate } = useSWR(
        comment.topic ? `get-topic-${comment.topic}` : null,
        () => topicApi.get(comment.topic)
    );

    const [showReply, replyState] = useState(false);
    const [text, setText] = useState('');

    if (comment.topic && !topic) return <Loading />;

    const className = review ? 'is-review' : reply ? 'is-reply' : '';
    const liked = comment.likes && comment.likes.indexOf(user) !== -1;

    let type;
    if (topic) {
        if (topic.doubt.find(c => c._id === comment._id)) type = 'doubt';
        if (!type && topic.resourceDump.find(c => c._id === comment._id)) type = 'resourceDump';
    }

    const toggleLike = async () => {
        try {
            const likeIndex = comment.likes.indexOf(user);

            if (likeIndex === -1) {
                await commentApi.like(comment._id);
                mutate({
                    ...topic,
                    [type]: [
                        ...topic[type].map(c =>
                            c === comment ? { ...c, likes: [...c.likes, user] } : c
                        )
                    ]
                });
            } else {
                await commentApi.unlike(comment._id);
                mutate({
                    ...topic,
                    [type]: [
                        ...topic[type].map(c =>
                            c === comment
                                ? {
                                      ...c,
                                      likes: [
                                          ...c.likes.slice(0, likeIndex),
                                          ...c.likes.slice(likeIndex + 1)
                                      ]
                                  }
                                : c
                        )
                    ]
                });
            }
        } catch (err) {
            if (err.errors) {
                const errors = err.errors;
                errors.forEach(e => dispatch(setAlert(e.msg, 'danger')));
            }
        }
    };

    const addReply = async () => {
        try {
            await commentApi.addReply(comment._id, { text });

            mutate({
                ...topic,
                [type]: [
                    ...topic[type].map(c =>
                        c === comment
                            ? { ...c, reply: [...c.reply, { user, text, date: Date.now() }] }
                            : c
                    )
                ]
            });

            replyState(true);
            setText('');
        } catch (err) {
            if (err.errors) {
                const errors = err.errors;
                errors.forEach(e => dispatch(setAlert(e.msg, 'danger')));
            }
        }
    };

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
                    <span className={liked ? 'icon active' : 'icon'} onClick={() => toggleLike()}>
                        <i className='far fa-thumbs-up outline'></i>
                        <i className='fas fa-thumbs-up filled'></i>
                    </span>
                    <p>{comment.likes && comment.likes.length}</p>
                </div>
                <div className='reply'>
                    <span
                        className={showReply ? 'icon active' : 'icon'}
                        onClick={() => replyState(!showReply)}>
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
                        onChange={e => setText(e.target.value)}
                        value={text}
                    />
                    <a href='#!' className={text ? 'active' : ''} onClick={addReply}>
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
