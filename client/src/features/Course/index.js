import React, { Fragment, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import useSWR from 'swr';

import course from '../../api/course';
import Header from './Header';
import Description from './Description';
import Content from './Content';
import Feedback from './Feedback';
import Review from './Review';
import Loading from '../../components/Loading';
import { pseudoState } from '../../utils/pseudoState';
import { setAlert } from '../Alerts/alertSlice';
import { useEdit } from '../../utils/hooks';

import './Course.css';

const Course = () => {
    // hooks
    const dispatch = useDispatch();
    const { courseId } = useParams();
    const [editing, edit] = useEdit();
    const [isSaving, setSave] = useState(false);
    const { data, error, mutate } = useSWR(`get-course-${courseId}`, () => course.get(courseId));
    const {
        isAuthenticated,
        loading,
        userData: { id }
    } = useSelector(state => state.auth);

    // check instructor
    const isInstructor = !loading && isAuthenticated && data && data.instructor._id === id;

    // check student
    const isStudent = !loading && isAuthenticated && data && data.students.includes(id);

    // error and loading
    if (error && navigator.onLine) return <div> Opps... not found </div>;
    if (!data) return <Loading />;
    if (editing && !isInstructor) {
        edit(false);
    }

    const [courseChanges, changeCourse] = pseudoState();

    const saveCourse = async () => {
        try {
            console.log(courseChanges);
            if (courseChanges['name'] === data.name) delete courseChanges['name'];
            if (courseChanges['description'] === data.description)
                delete courseChanges['description'];

            if (courseChanges['name'] === '') {
                dispatch(setAlert("Name can't be empty", 'danger'));
                return;
            }
            if (courseChanges['description'] === '') {
                dispatch(setAlert("Description can't be empty", 'danger'));
                return;
            }

            if (Object.keys(courseChanges).length > 0) {
                setSave(true);
                const updated = await course.update(courseId, courseChanges);
                mutate(updated, false);
                setSave(false);
            }

            edit(false);
        } catch (err) {
            console.error(err);
            if (err.errors) {
                const errors = err.errors;
                errors.forEach(e => dispatch(setAlert(e, 'danger')));
            }
            setSave(false);
            edit(false);
        }
    };

    return (
        <Fragment>
            <Header
                instructor={isInstructor}
                student={isStudent}
                edit={edit}
                editing={editing}
                course={data}
                changeCourse={changeCourse}
                saveCourse={saveCourse}
                isSaving={isSaving}
            />
            <div className='container'>
                <Description
                    editing={editing}
                    desc={data.description}
                    changeCourse={changeCourse}
                />
                <Content editing={editing} course={data} changeCourse={changeCourse} />
                {!editing &&
                    (data.reviews.length > 0 ? <Feedback course={data} /> : <p>No reviews yet</p>)}
                {!editing && data.reviews.length > 0 && <Review reviews={data.reviews} />}
            </div>
        </Fragment>
    );
};

export default Course;
