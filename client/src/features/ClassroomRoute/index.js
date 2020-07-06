import React, { useState, useEffect } from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import useSWR from 'swr';

import courseApi from '../../api/course';

import { setAlert } from '../../features/Alerts/alertSlice';
import Loading from '../../components/Loading';

const ClassroomRoute = props => {
    const dispatch = useDispatch();

    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (redirect) dispatch(setAlert('Course not enrolled.', 'danger'));
    });

    const {
        isAuthenticated,
        loading,
        userData: { id }
    } = useSelector(state => state.auth);

    const { pathname } = useLocation();
    const courseId = pathname.split('/')[2];

    const { data: course } = useSWR(`get-course-${courseId}`, () => courseApi.get(courseId));

    const isInstructor = !loading && isAuthenticated && course && course.instructor._id === id;
    const isStudent = !loading && isAuthenticated && course && course.students.indexOf(id) !== -1;

    if (!redirect && !loading && course && !isStudent && !isInstructor) {
        setRedirect(true);
    }

    return loading ? (
        <Loading />
    ) : redirect ? (
        <Redirect to={`/course/${courseId}`} />
    ) : (
        <Route {...props} />
    );
};

export default ClassroomRoute;
