import courseStore from '../../api/course';

export const addCourse = async (history, setLoading, addToState) => {
    const dummyCourse = {
        name: 'Add course name here',
        description: 'What is your course majorly about ?',
        imageURL: 'http://test.com'
    };

    setLoading(true);
    const courseRes = await courseStore.add(dummyCourse);
    addToState(courseRes);
    setLoading(false);
    history.replace(`/course/${courseRes._id}?edit=true`);
};
