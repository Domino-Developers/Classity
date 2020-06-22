import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Description from './Description';
import Content from './Content';
import Feedback from './Feedback';
import Review from './Review';

import './Course.css';

const Course = props => {
    const [editing, edit] = useState(true);

    return (
        <Fragment>
            <Header
                instructor={props.instructor}
                edit={edit}
                editing={editing}
            />
            <div className='course-page-content'>
                <Description editing={editing} />
                <Content editing={editing} />
                {!editing && <Feedback />}
                {!editing && <Review />}
            </div>
        </Fragment>
    );
};

Course.propTypes = {
    instructor: PropTypes.bool.isRequired
};

export default Course;
