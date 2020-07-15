import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Button from '../../components/Button';
import Rating from '../../components/Rating';
import Editable from '../../components/Editable';
import Html from '../../components/Html';
import courseApi from '../../api/course';
import { setAlert } from '../Alerts/alertSlice';

const Header = props => {
    const history = useHistory();
    const dispatch = useDispatch();

    const {
        instructor,
        edit,
        editing,
        course,
        courseChanges,
        saveCourse,
        cancelSave,
        enroll,
        isSaving,
        isEnrolling,
        student
    } = props;

    const name = useRef(course.name);

    const handleChange = e => {
        name.current = e.target.value;
        courseChanges.current.name = e.target.value;
    };

    const deleteCourse = async () => {
        try {
            if (window.confirm('Are you sure you want to delete course?')) {
                await courseApi.delete(course._id);
                history.replace('/dashboard');
                dispatch(setAlert('Course deleted', 'success'));
            }
        } catch (err) {
            if (err.errors) {
                const errors = err.errors;
                errors.forEach(e => dispatch(setAlert(e.msg, 'danger')));
            }
        }
    };

    return (
        <div className='course-header'>
            <div className='course-header__title'>
                <Editable
                    html={name.current}
                    tagName='h2'
                    onChange={handleChange}
                    disabled={!editing}
                />
            </div>
            <div className='course-header__description'>
                <Html tag='p'>{course.description}</Html>
            </div>
            <div className='course-header__rating'>
                <Rating rating={course.avgRating} />
                <p>
                    {course.avgRating.toFixed(1)} ({course.reviews.length} reviews)
                </p>
            </div>
            <div>{course.students.length} student(s) enrolled</div>
            <div>
                Created by <em>{course.instructor.name}</em>
            </div>
            <div>Last updated: {new Date(course.modifiedDate).toLocaleDateString()} </div>
            <div className='course-header__enroll'>
                {!instructor && !student && (
                    <Button
                        text='Enroll Course'
                        full
                        onClick={enroll}
                        loading={isEnrolling ? 'Enrolling' : null}
                    />
                )}
                {student && <Button text='Enrolled' full />}
                {instructor && !editing && (
                    <Button text='Edit Course' full onClick={() => edit(true)} />
                )}
                {instructor && editing && (
                    <div>
                        <Button
                            text='Save Course'
                            full
                            onClick={saveCourse}
                            loading={isSaving ? 'Saving' : null}
                            className='u-margin-right-small'
                        />
                        <Button text='Cancel' full onClick={cancelSave} />
                        <i
                            className='fas fa-trash-alt course-header__delete'
                            onClick={deleteCourse}></i>
                    </div>
                )}
            </div>
        </div>
    );
};

Header.propTypes = {
    instructor: PropTypes.bool.isRequired,
    editing: PropTypes.bool.isRequired,
    edit: PropTypes.func.isRequired,
    course: PropTypes.object.isRequired,
    courseChanges: PropTypes.object.isRequired,
    saveCourse: PropTypes.func.isRequired,
    cancelSave: PropTypes.func.isRequired,
    enroll: PropTypes.func.isRequired,
    isSaving: PropTypes.bool.isRequired,
    isEnrolling: PropTypes.bool.isRequired,
    student: PropTypes.bool.isRequired
};

export default Header;
