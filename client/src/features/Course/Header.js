import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import Button from '../../components/Button';
import Rating from '../../components/Rating';
import Editable from '../../components/Editable';
import Html from '../../components/Html';

const Header = props => {
    const {
        instructor,
        edit,
        editing,
        course,
        courseChanges,
        saveCourse,
        cancelSave,
        isSaving,
        student
    } = props;

    const name = useRef(course.name);

    const handleChange = e => {
        name.current = e.target.value;
        courseChanges.current.name = e.target.value;
    };

    return (
        <div className='course-header'>
            <div className='header-title'>
                <Editable
                    html={name.current}
                    tagName='h2'
                    onChange={handleChange}
                    disabled={!editing}
                />
            </div>
            <div className='header-description'>
                <Html tag='p'>{course.description}</Html>
            </div>
            <div className='header-rating'>
                <Rating rating={course.avgRating} />
                <p>
                    {course.avgRating}({course.reviews.length} reviews)
                </p>
            </div>
            <div>{course.students.length} student(s) enrolled</div>
            <div>
                Created by <em>{course.instructor.name}</em>
            </div>
            <div>Last updated: {new Date(course.modifiedDate).toLocaleDateString()} </div>
            <div className='header-enroll'>
                {!instructor && !student && <Button text='Enroll' full />}
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
                        />
                        <Button text='Cancel' full onClick={cancelSave} />
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
    isSaving: PropTypes.bool.isRequired,
    student: PropTypes.bool.isRequired
};

export default Header;
