import { createSlice } from '@reduxjs/toolkit';
import { sendFlushReq, sendTokenRes } from '../../utils/storageCom';

import user from '../../api/user';
import { setAlert } from '../Alerts/alertSlice';
import { setAuthToken, removeAuthToken } from '../../utils/authToken';
import { fetchUser } from '../User/userSlice';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        isAuthenticated: false,
        loading: true
    },
    reducers: {
        authStart: (state, action) => {
            state.token = null;
            state.isAuthenticated = false;
            state.loading = true;
        },
        authSuccess: (state, action) => {
            if (action.payload.remember) localStorage.setItem('GTS_TOKEN', action.payload.token);
            sessionStorage.setItem('GTS_TOKEN', action.payload.token);

            // send to other tabs if communicate
            if (!action.payload.dontCommunicate) sendTokenRes(action.payload.token);

            // Add auth header to axios
            setAuthToken(action.payload.token);

            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.loading = false;
        },
        authRejected: (state, action) => {
            localStorage.removeItem('GTS_TOKEN');
            sessionStorage.removeItem('GTS_TOKEN');

            // remove token from other tabs if comunicate
            if (!action.payload || (action.payload && !action.payload.dontCommunicate)) {
                console.log('sending logout');
                sendFlushReq();
            }

            // remove token from axios
            removeAuthToken();

            state.token = null;
            state.isAuthenticated = false;
            state.loading = false;
        }
    }
});

const { authRejected, authStart, authSuccess } = authSlice.actions;

export { authRejected, authSuccess };

export default authSlice.reducer;

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
        dispatch(authRejected());
        console.error(err);
    }
};

// function to init auth on start
export const initAuth = ({ dontCommunicate }) => dispatch => {
    const token = sessionStorage.getItem('GTS_TOKEN');
    if (token) {
        // auth success will be failed if token not valid later
        dispatch(authSuccess({ token, dontCommunicate }));

        // fetch user
        dispatch(fetchUser());
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
        dispatch(authRejected());
        console.error(err);
    }
};
