import api from './helper';

export default {
    // Add comment
    async add(topicId, type, comment) {
        try {
            const res = await api.put(`/api/topic/${topicId}/comment/${type}`, {
                body: comment
            });
            return res.data;
        } catch (err) {
            throw err.response.data;
        }
    },

    // Delete doubt/resourceDump
    async delete(topicId, comId) {
        try {
            const res = await api.delete(`/api/topic/${topicId}/comment/${comId}`);
            return res.data;
        } catch (err) {
            throw err.response.data;
        }
    },

    // like
    async like(commentId) {
        try {
            const res = await api.put(`/api/comment/${commentId}/like`);
            return res.data;
        } catch (err) {
            throw err.response.data;
        }
    },

    // unlike
    async unlike(commentId) {
        try {
            const res = await api.delete(`/api/comment/${commentId}/like`);
            return res.data;
        } catch (err) {
            throw err.response.data;
        }
    },

    // add reply
    async addReply(commentId, reply) {
        try {
            const res = await api.put(`/api/comment/${commentId}/reply`, {
                body: reply
            });

            return res.data;
        } catch (err) {
            throw err.response.data;
        }
    },

    // Delete a reply
    async deleteReply(commentId, replyId) {
        try {
            const res = await api.delete(`/api/comment/${commentId}/reply/${replyId}`);
            return res.data;
        } catch (err) {
            throw err.response.data;
        }
    }
};
