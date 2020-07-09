import axios from 'axios';

function getConfig(payload) {
    let config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    if (!payload.body) delete config.headers['Content-Type'];
    return config;
}

export default {
    get(url, payload) {
        if (payload)
            return axios.get(url, {
                params: {
                    source_content_type: 'application/json',
                    source: JSON.stringify(payload.query)
                }
            });
        return axios.get(url);
    },
    post(url, payload = {}) {
        return axios.post(url, payload.body, getConfig(payload));
    },
    put(url, payload = {}) {
        return axios.put(url, payload.body, getConfig(payload));
    },
    patch(url, payload = {}) {
        return axios.patch(url, payload.body, getConfig(payload));
    },
    delete(url) {
        return axios.delete(url);
    }
};
