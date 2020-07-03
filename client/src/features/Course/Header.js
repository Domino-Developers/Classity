import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Button from '../../components/Button';
import Rating from '../../components/Rating';
import Editable from '../../components/Editable';

const Header = props => {
    const { instructor, edit, editing, course } = props;
    const [name, changeName] = useState(course.name);

    return (
        <div className='course-header'>
            <div className='header-title'>
                <Editable
                    html={name}
                    tagName='h2'
                    onChange={e => changeName(e.target.value)}
                    disabled={!editing}
                />
            </div>
            <div className='header-description'>
                <p>{course.description}</p>
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
            <div>
                Last updated:{' '}
                {new Date(course.modifiedDate).toLocaleDateString()}{' '}
            </div>
            <div className='header-enroll'>
                {!instructor && <Button text='Enroll' full />}
                {instructor && !editing && (
                    <Button
                        text='Edit Course'
                        full
                        onClick={() => edit(true)}
                    />
                )}
                {instructor && editing && (
                    <Button
                        text='Save Course'
                        full
                        onClick={() => edit(false)}
                    />
                )}
            </div>
        </div>
    );
};

Header.propTypes = {
    instructor: PropTypes.bool.isRequired,
    editing: PropTypes.bool.isRequired,
    edit: PropTypes.func.isRequired,
    course: PropTypes.object.isRequired
};

export default Header;
