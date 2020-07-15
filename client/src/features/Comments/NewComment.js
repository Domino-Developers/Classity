import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Rating from '../../components/Rating';

const NewComment = ({ review, comments, onAdd, user, newText }) => {
    const [text, setText] = useState('');
    const [rating, setRating] = useState();

    if (isNaN(rating) && review) {
        const userReview = comments.find(r => r.user === user);

        if (userReview) {
            setRating(userReview.rating);
            setText(userReview.text);
        } else {
            setRating(0);
        }
    }

    return (
        <div>
            {review && <h4>Your review</h4>}
            {review && <Rating select={setRating} rating={rating} />}
            <input
                className='comment__input'
                type='text'
                onChange={e => setText(e.target.value)}
                value={text}
                placeholder={newText}
            />
            <a
                href='#!'
                className={
                    'comment__btn' + (text && (!review || rating) ? ' comment__btn--active' : '')
                }
                onClick={() => onAdd({ text, rating }, () => setText(''))}>
                &#9654;
            </a>
        </div>
    );
};

NewComment.propTypes = {
    review: PropTypes.bool,
    comments: PropTypes.array.isRequired,
    onAdd: PropTypes.func.isRequired,
    user: PropTypes.string.isRequired,
    newText: PropTypes.string
};

export default NewComment;
