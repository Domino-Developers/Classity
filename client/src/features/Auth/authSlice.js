import { createSlice } from '@reduxjs/toolkit';

import user from '../../api/user';
import { setAlert } from '../Alerts/alertSlice';
import { setAuthToken, removeAuthToken } from '../../utils/authToken';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        isAuthenticated: false,
        loading: false,
        userData: {}
    },
    reducers: {
        authStart: (state, action) => {
            state.token = null;
            state.isAuthenticated = false;
            state.loading = true;
            state.userData = {};
        },
        authSuccess: (state, action) => {
            if (action.payload.remember)
                localStorage.setItem('gtstudytoken', action.payload.token);

            // Add auth header to axios
            setAuthToken(action.payload.token);

            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.loading = false;
        },
        authFailed: (state, action) => {
            localStorage.removeItem('gtstudytoken');

            // remove token from axios
            removeAuthToken();

            state.token = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.userData = {};
        },
        fetchUserStart: (state, action) => {
            state.loading = true;
            state.userData = {};
        },
        fetchUserSuccess: (state, action) => {
            const user = action.payload;
            state.loading = false;
            state.userData = {
                id: user._id,
                name: user.name,
                avatar: user.avatar,
                email: user.email,
                coursesEnrolled: user.coursesEnrolled,
                coursesCreated: user.coursesCreated
            };
        }
    }
});

const {
    authFailed,
    authStart,
    authSuccess,
    fetchUserStart,
    fetchUserSuccess
} = authSlice.actions;

export default authSlice.reducer;

// function to fetch user with token
const fetchUser = () => async dispatch => {
    dispatch(fetchUserStart());
    try {
        const user_res = await user.getCurrentUserData();

        // success
        dispatch(fetchUserSuccess({ ...user_res }));
    } catch (err) {
        const errors = err.errors;
        errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        dispatch(authFailed());
        console.error(err);
    }
};

// function to init user on start
export const loadUser = () => dispatch => {
    const token = localStorage.getItem('gtstudytoken');
    if (token) {
        // auth success will be failed if token not valid later
        dispatch(authSuccess({ token }));

        // fetch user
        dispatch(fetchUser());
    }
};

// function to login user
export const login = (email, password, remember) => async dispatch => {
    dispatch(authStart());
    try {
        const token_res = await user.login({ email, password });

        // success
        dispatch(authSuccess({ token: token_res.token, remember }));

        // fetchUser
        dispatch(fetchUser());

        // notify user
        dispatch(setAlert('Logined Successfully', 'success', 2000));
    } catch (err) {
        const errors = err.errors;
        errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        dispatch(authFailed());
        console.error(err);
    }
};

// function to register user
export const register = (name, email, password) => async dispatch => {
    dispatch(authStart());

    try {
        const token_res = await user.register({ name, email, password });

        // success
        dispatch(authSuccess({ token: token_res.token, remember: false }));

        // fetchUser
        dispatch(fetchUser());

        // Notify user
        dispatch(setAlert('Registered Successfully', 'success', 2000));
    } catch (err) {
        const errors = err.errors;
        errors.forEach(error => {
            dispatch(setAlert(error.msg, 'danger'));
        });
        dispatch(authFailed());
        console.error(err);
    }
};
