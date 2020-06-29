import { combineReducers } from 'redux';
import alertReducer from '../features/Alerts/alertSlice';

export default combineReducers({
    alerts: alertReducer
});
