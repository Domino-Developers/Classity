import { createSlice } from '@reduxjs/toolkit';
import { setAlert } from '../Alerts/alertSlice';
import userStore from '../../api/user';
import courseStore from '../../api/course';
import topicStore from '../../api/topic';
import testStore from '../../api/test';

const initialState = {
    _id: null,
    name: null,
    email: null,
    avatar: null,
    coursesEnrolled: null,
    coursesCreated: null,
    loading: true,
    resourceLoading: false
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
            const { courseId, courseProgress, keepLoading } = action.payload;
            state.coursesEnrolled[courseId] = courseProgress;
            if (!keepLoading) state.resourceLoading = false;
        },
        resourceLoadStart: (state, action) => {
            state.resourceLoading = true;
        },
        resourceLoadStop: (state, action) => {
            state.resourceLoading = false;
        },
        enrollStart: (state, action) => {
            state.loading = false;
        },
        enrollSuccess: (state, action) => {
            state.loading = false;
            const { courseId, courseProgress } = action.payload;
            state.coursesEnrolled[courseId] = courseProgress;
        },
        enrollFail: (state, action) => {
            state.loading = false;
        },
        deleteCreatedCourse: (state, action) => {
            const { courseId } = action.payload;
            state.coursesCreated = state.coursesCreated.filter(id => id !== courseId);
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
    enrollStart,
    enrollFail,
    resourceLoadStart,
    resourceLoadStop,
    deleteCreatedCourse
} = userSlice.actions;

export { addCreatedCourse, fetchUserFail, addCourseProgress, deleteCreatedCourse };

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
    dispatch(enrollStart());
    try {
        const courseProgress = await courseStore.enroll(courseId);
        dispatch(enrollSuccess({ courseId, courseProgress }));
        await mutate(courseProgress);

        dispatch(setAlert('Enrolled Successfully', 'success'));
    } catch (err) {
        dispatch(setAlert('Server Error Please try again', 'danger'));
        dispatch(enrollFail());
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

export const completeCoreResource = (courseId, topicId, resId) => async dispatch => {
    dispatch(resourceLoadStart());
    try {
        const courseProgress = await topicStore.markComplete(topicId, resId);
        dispatch(addCourseProgress({ courseId, courseProgress }));
    } catch (err) {
        dispatch(setAlert('Error completing! Try again', 'danger'));
        dispatch(resourceLoadStop());
        if (err.errors) {
            const errors = [...err.errors];
            errors.forEach(e => dispatch(setAlert(e.msg, 'danger')));
        }
        console.error(err);
    }
};

export const addScore = (testId, score, courseId, topicId, resId, completed) => async dispatch => {
    dispatch(resourceLoadStart());
    try {
        const courseProgress = await testStore.addScore(testId, { score });
        dispatch(
            addCourseProgress({
                courseId: courseProgress.course,
                courseProgress,
                keepLoading: true
            })
        );
        if (completed) dispatch(completeCoreResource(courseId, topicId, resId));
        else dispatch(resourceLoadStop());
    } catch (err) {
        dispatch(setAlert('Some error! Please try again', 'danger'));
        dispatch(resourceLoadStop());
        if (err.errors) {
            const errors = [...err.errors];
            errors.forEach(e => dispatch(setAlert(e.msg, 'danger')));
        }
        console.error(err);
    }
};
