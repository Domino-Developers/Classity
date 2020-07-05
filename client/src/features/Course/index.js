import React, { Fragment, useState } from 'react';
import { useParams } from 'react-router-dom';
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
import pseudoState from '../../utils/pseudoState';
import stripHtml from '../../utils/stripHtml';
import { setAlert } from '../Alerts/alertSlice';
import { useEdit } from '../../utils/hooks';

import './Course.css';

const Course = () => {
    // hooks
    const dispatch = useDispatch();
    const { courseId } = useParams();
    const [editing, edit] = useEdit();
    const [isSaving, setSave] = useState(false);
    const { data: course, error } = useSWR(`get-course-${courseId}`, () => courseApi.get(courseId));
    const {
        isAuthenticated,
        loading,
        userData: { id }
    } = useSelector(state => state.auth);

    // check instructor
    const isInstructor = !loading && isAuthenticated && course && course.instructor._id === id;

    // check student
    const isStudent = !loading && isAuthenticated && course && course.students.includes(id);

    // error and loading
    if (error && navigator.onLine) return <div> Opps... not found </div>;
    if (!course) return <Loading />;
    if (editing && !isInstructor) edit(false);

    const [courseChanges, changeCourse] = pseudoState();

    const saveCourse = async () => {
        try {
            const promises = [];

            // For updating course name & description
            if (courseChanges.name === course.name) delete courseChanges.name;
            if (courseChanges.description === course.description) delete courseChanges.description;

            if (stripHtml(courseChanges.name) === '') {
                dispatch(setAlert("Name can't be empty", 'danger'));
                return;
            }
            if (stripHtml(courseChanges.description) === '') {
                dispatch(setAlert("Description can't be empty", 'danger'));
                return;
            }

            if (courseChanges.name || courseChanges.description)
                promises.push(courseApi.update(courseId, courseChanges));

            // For deleting/renaming topic
            course.topics.forEach(topic => {
                const newTopicIndex = courseChanges.topics.findIndex(
                    newTopic => newTopic._id === topic._id
                );

                if (newTopicIndex === -1) {
                    promises.push(topicApi.delete(course._id, topic._id));
                } else if (courseChanges.topics[newTopicIndex].name !== topic.name) {
                    promises.push(
                        topicApi.update(topic._id, {
                            name: courseChanges.topics[newTopicIndex].name
                        })
                    );
                }
            });

            // For adding new topic
            courseChanges.topics.forEach((topic, i) => {
                if (!topic._id)
                    promises.push(topicApi.add(course._id, { name: topic.name, position: i }));
            });

            setSave(true);
            await Promise.all(promises);
            setSave(false);
            edit(false);
        } catch (err) {
            if (err.errors) {
                const errors = err.errors;
                errors.forEach(e => dispatch(setAlert(e, 'danger')));
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
                changeCourse={changeCourse}
                course={course}
                saveCourse={saveCourse}
                cancelSave={cancel}
                isSaving={isSaving}
            />
            <div className='container'>
                <Description
                    editing={editing}
                    desc={course.description}
                    changeCourse={changeCourse}
                />
                <Content editing={editing} course={course} changeCourse={changeCourse} />

                {!editing &&
                    (course.reviews.length > 0 ? (
                        <Feedback course={course} />
                    ) : (
                        <p>No reviews yet</p>
                    ))}
                {!editing && course.reviews.length > 0 && <Review reviews={course.reviews} />}
            </div>
        </Fragment>
    );
};

export default Course;
