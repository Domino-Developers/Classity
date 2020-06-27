import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AnimateHeight from 'react-animate-height';

import FadeText from '../../components/FadeText';
import Rating from '../../components/Rating';

const Comment = props => {
    const { review, reply, replies } = props;

    const [showReply, replyState] = useState(false);
    const [text, changeText] = useState('');

    const className = review ? 'is-review' : reply ? 'is-reply' : '';

    return (
        <li className={className}>
            <div className='comment'>
                <p className='date'>10/06/2020</p>
                <div className='rating'>
                    <Rating rating='2' />
                </div>
                <div className='like'>
                    <span className='icon active'>
                        <i className='far fa-thumbs-up outline'></i>
                        <i className='fas fa-thumbs-up filled'></i>
                    </span>
                    <p>2</p>
                </div>
                <div className='reply'>
                    <span
                        className={showReply ? 'icon active' : 'icon'}
                        onClick={() => replyState(!showReply)}
                    >
                        <i className='far fa-comment-dots outline'></i>
                        <i className='fas fa-comment-dots filled'></i>
                    </span>
                    <p>500</p>
                </div>
                <p className='name'>Sanchit Arora</p>
                <div className='text'>
                    <FadeText>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </FadeText>
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
                        {replies.map((e, i) => (
                            <Comment reply key={i} />
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
    replies: PropTypes.array
};

export default Comment;
