import { createSlice } from '@reduxjs/toolkit';
import userStore from '../../api/user';
import courseStore from '../../api/course';
import { setAlert } from '../Alerts/alertSlice';

const initialState = {
    _id: null,
    name: null,
    email: null,
    avatar: null,
    coursesEnrolled: null,
    coursesCreated: null,
    loading: true
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        fetchUserStart: (state, action) => {
            state.loading = true;
            state._id = null;
            state.name = null;
            state.avatar = null;
            state.email = null;
            state.coursesEnrolled = null;
            state.coursesCreated = null;
        },
        fetchUserSuccess: (state, action) => {
            const user = action.payload;
            state.loading = false;
            state._id = user._id;
            state.name = user.name;
            state.avatar = user.avatar;
            state.email = user.email;
            state.coursesEnrolled = user.coursesEnrolled;
            state.coursesCreated = user.coursesCreated;
        },
        fetchUserFail: (state, action) => {
            state.loading = false;
            state._id = null;
            state.name = null;
            state.avatar = null;
            state.email = null;
            state.coursesEnrolled = null;
            state.coursesCreated = null;
        },
        addCreatedCourse: (state, action) => {
            const { courseId } = action.payload;
            state.coursesCreated.push(courseId);
        },
        addCourseProgress: (state, action) => {
            const { courseId, courseProgress } = action.payload;
            state.coursesEnrolled[courseId] = courseProgress;
        },
        loadStart: (state, action) => {
            state.loading = true;
        },
        enrollSuccess: (state, action) => {
            state.loading = false;
            const { courseId, courseProgress } = action.payload;
            state.coursesEnrolled[courseId] = courseProgress;
        },
        loadStop: (state, action) => {
            state.loading = false;
        }
    }
});

const {
    fetchUserStart,
    fetchUserSuccess,
    addCreatedCourse,
    addCourseProgress,
    enrollSuccess,
    fetchUserFail,
    loadStart,
    loadStop
} = userSlice.actions;

export { addCreatedCourse, fetchUserFail, addCourseProgress };

export default userSlice.reducer;

export const fetchUser = () => async dispatch => {
    dispatch(fetchUserStart());
    try {
        const user_res = await userStore.getCurrentUserData();

        // success
        dispatch(fetchUserSuccess({ ...user_res }));
    } catch (err) {
        const errors = [...err.errors];
        errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        dispatch(fetchUserFail());
        console.error(err);
    }
};

export const enroll = (courseId, mutate) => async dispatch => {
    dispatch(loadStart());
    try {
        const courseProgress = await courseStore.enroll(courseId);
        await mutate(courseProgress);
        dispatch(enrollSuccess({ courseId, courseProgress }));

        dispatch(setAlert('Enrolled Successfully', 'success'));
    } catch (err) {
        dispatch(setAlert('Server Error Please try again', 'danger'));
        dispatch(loadStop());
        if (err.errors) {
            const errors = [...err.errors];
            errors.forEach(e => dispatch(setAlert(e.msg, 'danger')));
        }
        console.error(err);
    }
};

export const addCourseProgressIfNeeded = (courseId, courseProgress) => (dispatch, getState) => {
    const state = getState();
    if (typeof state.user.coursesEnrolled[courseId] === 'string')
        dispatch(addCourseProgress({ courseId, courseProgress }));
};
