import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import rootReducer from './rootReducer';
import { authRejected } from '../features/Auth/authSlice';
import { fetchUserFail } from '../features/User/userSlice';

// custom middleware

const rejecter = store => next => action => {
    if (
        action.type === 'auth/authRejected' &&
        (!action.payload || (action.payload && !action.payload.dontGoOn))
    ) {
        store.dispatch(fetchUserFail({ dontGoOn: true }));
        return next(action);
    } else if (
        action.type === 'user/fetchUserFail' &&
        (!action.payload || (action.payload && !action.payload.dontGoOn))
    ) {
        const result = next(action);
        store.dispatch(authRejected({ dontGoOn: true }));
        return result;
    } else {
        return next(action);
    }
};

const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: [...getDefaultMiddleware(), rejecter]
});

export default store;
