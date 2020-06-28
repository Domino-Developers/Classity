import { combineReducers } from 'redux';
import alertReducer from '../features/Alerts/AlertSlice';

export default combineReducers({
    alerts: alertReducer
});
