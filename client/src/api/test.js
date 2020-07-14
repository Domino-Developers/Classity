import api from './helper';

export default {
    // add test
    async add(topicId, testData) {
        try {
            const res = await api.post(`/api/topic/${topicId}/test`, {
                body: testData
            });
            return res.data;
        } catch (err) {
            throw err.response.data;
        }
    },

    // get test
    async get(testId) {
        try {
            const res = await api.get(`/api/test/${testId}`);
            return res.data;
        } catch (err) {
            throw err.response.data;
        }
    },

    // update Test
    async update(testId, testData) {
        try {
            const res = await api.patch(`/api/test/${testId}`, {
                body: testData
            });
            return res.data;
        } catch (err) {
            throw err.response.data;
        }
    },

    // Add test Score
    async addScore(testId, scoreData) {
        try {
            const res = await api.put(`/api/test/${testId}`, {
                body: scoreData
            });
            return res.data;
        } catch (err) {
            throw err.response.data;
        }
    }
};
