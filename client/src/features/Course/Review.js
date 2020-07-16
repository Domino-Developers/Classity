import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import useSWR from 'swr';

import courseApi from '../../api/course';
import Comments from '../Comments';
import Loading from '../../components/Loading';
import { setAlert } from '../Alerts/alertSlice';

const Review = ({ isStudent, isInstructor }) => {
    const dispatch = useDispatch();

    const id = useSelector(state => state.user._id);
    const { courseId } = useParams();
    const { data: course, mutate } = useSWR(`get-course-${courseId}`, () =>
        courseApi.get(courseId)
    );

    if (!course) return <Loading />;

    const add = async review => {
        try {
            await courseApi.review(course._id, review);

            const newReview = { ...review, user: id, date: Date.now() };
            const reviews = [...course.reviews];
            const reviewIndex = reviews.findIndex(r => r.user === id);

            if (reviewIndex !== -1) {
                reviews[reviewIndex] = newReview;
            } else {
                reviews.push(newReview);
            }

            mutate({ ...course, reviews });
        } catch (err) {
            if (err.errors) {
                const errors = err.errors;
                errors.forEach(e => dispatch(setAlert(e.msg, 'danger')));
            }
        }
    };

    let newComment;
    if (!isStudent) newComment = 'Enroll to add a review';
    if (isInstructor) newComment = "Instructor can't add review";

    return (
        <section className='reviews'>
            <h3 className='reviews__heading'>Reviews</h3>
            <Comments
                review
                comments={course.reviews}
                onAdd={add}
                user={id}
                newComment={newComment}
            />
        </section>
    );
};

export default Review;
