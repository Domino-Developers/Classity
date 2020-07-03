import api from './helper';

export default {
    // add course
    async add(courseData) {
        try {
            const res = await api.post('/api/course', {
                body: JSON.stringify(courseData)
            });
            return res.data;
        } catch (err) {
            throw err.response.data;
        }
    },
    async getAllCoursesMin() {
        try {
            const res = await api.get('/api/course');
            return res.data;
        } catch (err) {
            throw err.response.data;
        }
    },

    // Get course all course data
    async get(courseId) {
        try {
            const res = await api.get(`/api/course/${courseId}`);
            return res.data;
        } catch (err) {
            throw err.response.data;
        }
    },

    // Enroll in a course
    async enroll(courseId) {
        try {
            const res = await api.put(`/api/course/${courseId}/enroll`);
            return res.data;
        } catch (err) {
            throw err.response.data;
        }
    },

    // Update lastStudied
    async updateLastStudied(courseId) {
        try {
            const res = await api.put(`/api/course/${courseId}/lastStudied`);
            return res.data;
        } catch (err) {
            throw err.response.data;
        }
    },

    // Add / update review
    async review(courseId, reviewData) {
        try {
            const res = await api.put(`/api/course/${courseId}/review`, {
                body: JSON.stringify(reviewData)
            });
            return res.data;
        } catch (err) {
            throw err.response.data;
        }
    },

    // update course desc, tags, name, imageURL
    async update(courseId, courseData) {
        try {
            const res = await api.post(`/api/course/${courseId}`, {
                body: courseData
            });
            return res.data;
        } catch (err) {
            throw err.response.data;
        }
    },

    // DELETE course
    async delete(courseId) {
        try {
            const res = await api.delete(`/api/course/${courseId}`);
            return res.data;
        } catch (err) {
            throw err.response.data;
        }
    }
};
