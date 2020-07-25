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

    const className = review ? 'review' : reply ? 'reply' : '';
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
                mutate(
                    {
                        ...topic,
                        [type]: [
                            ...topic[type].map(c =>
                                c === comment ? { ...c, likes: [...c.likes, user] } : c
                            )
                        ]
                    },
                    false
                );
                await commentApi.like(comment._id);
            } else {
                mutate(
                    {
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
                    },
                    false
                );
                await commentApi.unlike(comment._id);
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
            mutate(
                {
                    ...topic,
                    [type]: [
                        ...topic[type].map(c =>
                            c === comment
                                ? { ...c, reply: [...c.reply, { user, text, date: Date.now() }] }
                                : c
                        )
                    ]
                },
                false
            );

            await commentApi.addReply(comment._id, { text });

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
        <li className={'comment' + (className ? ` comment--${className}` : '')}>
            <div className='comment__container'>
                <p className='comment__date'>
                    <FromNow date={comment.date} />
                </p>
                <div className='comment__rating'>
                    <Rating rating={comment.rating || 0} />
                </div>
                <div className='comment__like'>
                    <span
                        className={
                            'comment__icon-container' +
                            (liked ? ' comment__icon-container--active' : '')
                        }
                        onClick={() => toggleLike()}>
                        <i className='far fa-thumbs-up comment__icon comment__icon--outline'></i>
                        <i className='fas fa-thumbs-up comment__icon comment__icon--filled'></i>
                    </span>
                    <p>{comment.likes && comment.likes.length}</p>
                </div>
                <div className='comment__reply'>
                    <span
                        className={
                            'comment__icon-container' +
                            (showReply ? ' comment__icon-container--active' : '')
                        }
                        onClick={() => replyState(!showReply)}>
                        <i className='far fa-comment-dots comment__icon comment__icon--outline'></i>
                        <i className='fas fa-comment-dots comment__icon comment__icon--filled'></i>
                    </span>
                    <p>{comment.reply && comment.reply.length}</p>
                </div>
                <p className='comment__name'>{comment.user.name}</p>
                <div className='comment__text'>
                    <FadeText>{comment.text}</FadeText>
                </div>
                <form action='#!' onSubmit={addReply} className='comment__add'>
                    <input
                        className='comment__input input'
                        type='text'
                        placeholder='Reply'
                        onChange={e => setText(e.target.value)}
                        value={text}
                    />
                    <a
                        href='#!'
                        className={'comment__btn' + (text ? ' comment__btn--active' : '')}
                        onClick={addReply}>
                        &#9654;
                    </a>
                </form>
            </div>
            {!reply && !review && (
                <AnimateHeight height={showReply ? 'auto' : 0}>
                    <h4 className='comment__heading'>Replies</h4>
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
    user: PropTypes.object
};

export default Comment;
