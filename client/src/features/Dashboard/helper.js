import courseStore from '../../api/course';

export const addCourse = async (history, setLoading, addToState) => {
    const dummyCourse = {
        name: 'Add course name here',
        description:
            '<p>This is short description of course.</p><p>Everything before an empty line will come in your course header.</p><br><p>From this line everything will show only here</p><p>Plan and write a good description.</p>',
        imageURL: 'https://via.placeholder.com/280x200.png?text=A'
    };

    setLoading(true);
    const courseRes = await courseStore.add(dummyCourse);
    addToState(courseRes);
    setLoading(false);
    history.replace(`/course/${courseRes._id}?edit=true`);
};
