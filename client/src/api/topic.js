import api from './helper';

export default {
    // Add topic
    async add(courseId, topicData) {
        try {
            const res = await api.put(`/api/course/${courseId}/topic`, {
                body: JSON.stringify(topicData)
            });
            return res.data;
        } catch (err) {
            throw err.response.data;
        }
    },

    // Delete topic
    async delete(courseId, topicId) {
        try {
            const res = await api.delete(
                `/api/course/${courseId}/topic/${topicId}`
            );
            return res.data;
        } catch (err) {
            throw err.response.data;
        }
    },

    // set coreResources
    async setCoreResources(topicId, coreResources) {
        try {
            const res = await api.put(`/api/topic/${topicId}/coreResources`, {
                body: JSON.stringify(coreResources)
            });
            return res.data;
        } catch (err) {
            throw err.response.data;
        }
    },

    // Delete coreResource
    async deleteCoreResource(topicId, cresId) {
        try {
            const res = await api.delete(
                `/api/topic/${topicId}/coreResource/${cresId}`
            );
            return res.data;
        } catch (err) {
            throw err.response.data;
        }
    }
};
