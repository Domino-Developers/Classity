import { createSlice } from '@reduxjs/toolkit';
import { sendFlushReq, sendTokenRes } from '../../utils/storageCom';

import user from '../../api/user';
import { setAlert } from '../Alerts/alertSlice';
import { setAuthToken, removeAuthToken } from '../../utils/authToken';
import { fetchUser, setNextTokenDate, fetchUserStart } from '../User/userSlice';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        isAuthenticated: false,
        loading: true,
        inactive: false
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
            state.inactive = false;
        },
        authRejected: (state, action) => {
            localStorage.removeItem('GTS_TOKEN');
            sessionStorage.removeItem('GTS_TOKEN');

            // remove token from other tabs if comunicate
            if (!action.payload || (action.payload && !action.payload.dontCommunicate)) {
                sendFlushReq();
            }

            // remove token from axios
            removeAuthToken();

            state.token = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.inactive = false;
        },
        setInactive: (state, action) => {
            localStorage.removeItem('GTS_TOKEN');
            sessionStorage.removeItem('GTS_TOKEN');
            if (!action.payload || (action.payload && !action.payload.dontCommunicate)) {
                sendFlushReq();
            }
            removeAuthToken();
            state.token = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.inactive = action.payload.inactive;
        }
    }
});

const { authRejected, authStart, authSuccess, setInactive } = authSlice.actions;

export { authRejected, authSuccess, setInactive };

export default authSlice.reducer;

// function to login user
export const login = (email, password, remember) => async dispatch => {
    dispatch(authStart());
    try {
        const token_res = await user.login({ email, password });

        if (token_res.inactive) {
            dispatch(setNextTokenDate(token_res.nextTokenRequest));
            dispatch(setInactive({ inactive: true }));
        } else {
            dispatch(authSuccess({ token: token_res.token, remember }));
            dispatch(fetchUser());
            dispatch(setAlert('Logged in Successfully', 'success', 2000));
        }

        // success
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
        dispatch(fetchUserStart());
        dispatch(authSuccess({ token, dontCommunicate }));
        dispatch(fetchUser());
    }
};
