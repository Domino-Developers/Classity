import axios from 'axios';

export const setAuthToken = token => {
    axios.defaults.headers.common['x-auth-token'] = token;
};

export const removeAuthToken = () => {
    delete axios.defaults.headers.common['x-auth-token'];
};
