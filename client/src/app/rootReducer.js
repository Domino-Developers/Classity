import { combineReducers } from 'redux';

// reducers
import alertReducer from '../features/Alerts/alertSlice';
import authReducer from '../features/Auth/authSlice';
import userReducer from '../features/User/userSlice';

export default combineReducers({
    alerts: alertReducer,
    auth: authReducer,
    user: userReducer
});
