import React, { Fragment, useState, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import useSWR from 'swr';

import courseApi from '../../api/course';
import topicApi from '../../api/topic';
import Header from './Header';
import Description from './Description';
import Content from './Content';
import Feedback from './Feedback';
import Review from './Review';
import Loading from '../../components/Loading';
import stripHtml from '../../utils/stripHtml';
import { setAlert } from '../Alerts/alertSlice';
import { useEdit } from '../../utils/hooks';

import './Course.css';
import { enroll } from '../User/userSlice';
import { createSelector } from '@reduxjs/toolkit';

const sel = createSelector(
    [
        state => state.auth.isAuthenticated,
        state => state.auth.loading,
        state => state.user._id,
        state => state.user.loading
    ],
    (isAuthenticated, loading1, _id, loading2) => ({
        isAuthenticated,
        loading1,
        loading2,
        _id
    })
);

const Course = () => {
    // hooks
    const dispatch = useDispatch();
    const history = useHistory();
    const { courseId } = useParams();
    const [editing, edit] = useEdit();
    const [isSaving, setSave] = useState(false);
    const { data: course, error, mutate } = useSWR(`get-course-${courseId}`, () =>
        courseApi.get(courseId)
    );
    const { isAuthenticated, loading1, loading2, _id: id } = useSelector(sel);
    const loading = loading1 || loading2;
    const courseChanges = useRef({});

    const isInstructor = !loading && isAuthenticated && course && course.instructor._id === id;
    const isStudent = !loading && isAuthenticated && course && course.students.includes(id);

    // error and loading
    if (error && navigator.onLine) return <div> Opps... not found </div>;
    if (!course) return <Loading />;
    if (editing && !isInstructor) edit(false);

    const onEnroll = async () => {
        if (!id) {
            history.push('?authMode=register');
            dispatch(setAlert('Please Register or Login to Enroll', 'danger'));
            return;
        }
        dispatch(
            enroll(courseId, async () => {
                await mutate({ ...course, students: [...course.students, id] });
            })
        );
    };

    const saveCourse = async () => {
        try {
            const promises = [];

            // For updating course name & description
            if (courseChanges.current.name === course.name) delete courseChanges.current.name;
            if (courseChanges.current.description === course.description)
                delete courseChanges.current.description;

            if (stripHtml(courseChanges.current.name) === '') {
                dispatch(setAlert("Name can't be empty", 'danger'));
                return;
            }
            if (stripHtml(courseChanges.current.description) === '') {
                dispatch(setAlert("Description can't be empty", 'danger'));
                return;
            }

            if (courseChanges.current.name || courseChanges.current.description)
                promises.push(courseApi.update(courseId, courseChanges.current));

            // For deleting/renaming topic
            course.topics.forEach(topic => {
                const newTopicIndex = courseChanges.current.topics.findIndex(
                    newTopic => newTopic._id === topic._id
                );

                if (newTopicIndex === -1) {
                    promises.push(topicApi.delete(course._id, topic._id));
                } else if (courseChanges.current.topics[newTopicIndex].name !== topic.name) {
                    promises.push(
                        topicApi.update(topic._id, {
                            name: courseChanges.current.topics[newTopicIndex].name
                        })
                    );
                }
            });

            // For adding new topic
            courseChanges.current.topics.forEach((topic, i) => {
                if (!topic._id)
                    promises.push(topicApi.add(course._id, { name: topic.name, position: i }));
            });

            setSave(true);
            await Promise.all(promises);
            await mutate();
            setSave(false);
            edit(false);
        } catch (err) {
            if (err.errors) {
                const errors = err.errors;
                errors.forEach(e => dispatch(setAlert(e.msg, 'danger')));
            }
            setSave(false);
            edit(false);
        }
    };

    const cancel = () => {
        edit(false);
        window.location.reload(false);
    };

    return (
        <Fragment>
            <Header
                instructor={isInstructor}
                student={isStudent}
                edit={edit}
                editing={editing}
                course={course}
                saveCourse={saveCourse}
                cancelSave={cancel}
                enroll={onEnroll}
                isSaving={isSaving}
                isEnrolling={loading2}
                courseChanges={courseChanges}
            />
            <div className='container'>
                <Description
                    editing={editing}
                    desc={course.description}
                    courseChanges={courseChanges}
                />
                <Content editing={editing} course={course} courseChanges={courseChanges} />

                {!editing && course.reviews.length > 0 && <Feedback course={course} />}
                {!editing && <Review />}
            </div>
        </Fragment>
    );
};

export default Course;
