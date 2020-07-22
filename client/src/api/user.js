import api from './helper';

export default {
    // Login user
    async login(userData) {
        try {
            const token_res = await api.post('/api/auth', {
                body: userData
            });
            return token_res.data;
        } catch (err) {
            throw err.response.data;
        }
    },

    // Register user
    async register(userData) {
        try {
            const token_res = await api.post('/api/users', {
                body: userData
            });
            return token_res.data;
        } catch (err) {
            throw err.response.data;
        }
    },

    // get current user data
    async getCurrentUserData() {
        try {
            const token_res = await api.get('/api/auth');
            return token_res.data;
        } catch (err) {
            throw err.response.data;
        }
    },

    async verifyEmailToken(token, id) {
        try {
            const res = await api.put('/api/users/email-verify', { body: { token, id } });
            return res.data;
        } catch (err) {
            throw err.response.data;
        }
    }
};
