import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import useSWR from 'swr';
import { createSelector } from '@reduxjs/toolkit';

import courseApi from '../../api/course';
import Comments from '../Comments';
import Loading from '../../components/Loading';
import { setAlert } from '../Alerts/alertSlice';

const sel = createSelector([state => state.user._id, state => state.user.name], (id, name) => ({
    id,
    name
}));

const Review = ({ isStudent, isInstructor }) => {
    const dispatch = useDispatch();

    const { id, name } = useSelector(sel);
    const { courseId } = useParams();
    const { data: course, mutate } = useSWR(`get-course-${courseId}`, () =>
        courseApi.get(courseId)
    );

    const resourcesDoneByTopic = course.courseProgress && course.courseProgress.topicStatus;
    const resourcesDone = [];
    Object.values(resourcesDoneByTopic || {}).forEach(res => {
        resourcesDone.push(...res);
    });

    if (!course) return <Loading />;

    const add = async review => {
        try {
            const newReview = { ...review, user: { _id: id, name }, date: Date.now() };
            const reviews = [...course.reviews];
            const reviewIndex = reviews.findIndex(r => r.user._id === id);

            if (reviewIndex !== -1) {
                reviews[reviewIndex] = newReview;
            } else {
                reviews.push(newReview);
            }

            mutate({ ...course, reviews }, false);

            await courseApi.review(course._id, review);
        } catch (err) {
            if (err.errors) {
                const errors = err.errors;
                errors.forEach(e => dispatch(setAlert(e.msg, 'danger')));
            }
        }
    };

    let newComment;
    if (!isStudent) newComment = 'Enroll to add a review';
    if (isStudent && !resourcesDone.length)
        newComment = 'Complete some part of course to add a review';
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
