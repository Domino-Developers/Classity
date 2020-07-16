import courseStore from '../../api/course';

export const addCourse = async (history, setLoading, addToState) => {
    const dummyCourse = {
        name: 'Add course name here',
        description: 'What is your course majorly about ?',
        imageURL: 'https://via.placeholder.com/280x200.png?text=A'
    };

    setLoading(true);
    const courseRes = await courseStore.add(dummyCourse);
    addToState(courseRes);
    setLoading(false);
    history.replace(`/course/${courseRes._id}?edit=true`);
};
