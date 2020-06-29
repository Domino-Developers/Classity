import { createSlice } from '@reduxjs/toolkit';

let alertId = 0;
const alertSlice = createSlice({
    name: 'alerts',
    initialState: [],
    reducers: {
        addAlert(state, action) {
            const { id, type, text } = action.payload;
            state.push({ id, type, text });
        },
        removeAlert(state, action) {
            const { id } = action.payload;
            const idx = state.findIndex(alt => alt.id === id);
            state.splice(idx, 1);
        }
    }
});
const { addAlert, removeAlert } = alertSlice.actions;

export default alertSlice.reducer;

// Alert function for creating and removing alerts
export const alert = (text, type, timeout = 5000) => dispatch => {
    const id = alertId++;
    dispatch(addAlert({ id, text, type }));
    setTimeout(() => {
        dispatch(removeAlert({ id }));
    }, timeout);
};
