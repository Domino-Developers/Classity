import api from './helper';

export async function submitFeedback(feedback) {
    try {
        const res = await api.post('/api/feedback', {
            body: feedback
        });
        return res.data;
    } catch (err) {
        throw err.response.data;
    }
}
