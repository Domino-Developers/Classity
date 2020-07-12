import React, { useState, useEffect } from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import useSWR from 'swr';

import courseApi from '../../api/course';

import { setAlert } from '../../features/Alerts/alertSlice';
import Loading from '../../components/Loading';
import { addCourseProgressIfNeeded } from '../User/userSlice';

const sel = createSelector(
    [
        state => state.auth.isAuthenticated,
        state => state.auth.loading,
        state => state.user._id,
        state => state.user.loading
    ],
    (isAuthenticated, loading1, id, loading2) => ({
        loading: loading1 || loading2,
        isAuthenticated,
        id
    })
);

const ClassroomRoute = props => {
    const dispatch = useDispatch();
    const [redirect, setRedirect] = useState(false);
    useEffect(() => {
        if (redirect) dispatch(setAlert('Course not enrolled.', 'danger'));
    });
    const { isAuthenticated, loading, id } = useSelector(sel);
    const { pathname } = useLocation();
    const courseId = pathname.split('/')[2];
    const { data: course, error } = useSWR(!loading ? `get-course-${courseId}` : null, () =>
        courseApi.get(courseId)
    );

    if (error && navigator.onLine) return <div>Opps</div>;
    if (!course || loading) return <Loading />;

    const isInstructor = isAuthenticated && course.instructor._id === id;
    const isStudent = isAuthenticated && course.students.indexOf(id) !== -1;

    if (!redirect && !isStudent && !isInstructor) {
        setRedirect(true);
    }

    if (isStudent) {
        dispatch(addCourseProgressIfNeeded(courseId, course.courseProgress));
    }

    return redirect ? <Redirect to={`/course/${courseId}`} /> : <Route {...props} />;
};

export default ClassroomRoute;
