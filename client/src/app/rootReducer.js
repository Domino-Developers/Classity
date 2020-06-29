import { combineReducers } from 'redux';

// reducers
import alertReducer from '../features/Alerts/alertSlice';
import authReducer from '../features/Auth/authSlice';

export default combineReducers({
    alerts: alertReducer,
    auth: authReducer
});
