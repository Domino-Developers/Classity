import axios from 'axios';

function getConfig(payload) {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    if (!payload.body) delete config.headers['Content-Type'];
}

export default {
    get(url) {
        return axios.get(url);
    },
    post(url, payload) {
        return axios.post(url, payload.body, getConfig(payload));
    },
    put(url, payload) {
        return axios.put(url, payload.body, getConfig(payload));
    },
    patch(url, payload) {
        return axios.patch(url, payload.body, getConfig(payload));
    },
    delete(url) {
        return axios.delete(url);
    }
};
