import { createSlice } from '@reduxjs/toolkit';
import userStore from '../../api/user';
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
            state.id = null;
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
            state.id = null;
            state.name = null;
            state.avatar = null;
            state.email = null;
            state.coursesEnrolled = null;
            state.coursesCreated = null;
        },
        addEnrolledCourse: (state, action) => {
            const { courseId, courseProgressId } = action.payload;
            state.coursesEnrolled[courseId] = courseProgressId;
        },
        addCreatedCourse: (state, action) => {
            const { courseId } = action.payload;
            state.coursesCreated.push(courseId);
        }
    }
});

const {
    fetchUserStart,
    fetchUserSuccess,
    addCreatedCourse,
    addEnrolledCourse,
    fetchUserFail
} = userSlice.actions;

export { addEnrolledCourse, addCreatedCourse, fetchUserFail };

export default userSlice.reducer;

export const fetchUser = () => async dispatch => {
    dispatch(fetchUserStart());
    try {
        const user_res = await userStore.getCurrentUserData();

        // success
        dispatch(fetchUserSuccess({ ...user_res }));
    } catch (err) {
        const errors = err.errors;
        errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        dispatch(fetchUserFail());
        console.error(err);
    }
};
