import React, { Fragment, useState, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import useSWR, { mutate } from 'swr';

import courseApi from '../../api/course';
import topicApi from '../../api/topic';
import Header from './Header';
import ImageUploader from './ImageUploader';
import Tags from './Tags';
import Description from './Description';
import Content from './Content';
import Feedback from './Feedback';
import Review from './Review';
import Loading from '../../components/Loading';
import Button from '../../components/Button';
import stripHtml from '../../utils/stripHtml';
import readFile from '../../utils/readFile';
import { setAlert } from '../Alerts/alertSlice';
import { useEdit } from '../../utils/hooks';

import { enroll, addCourseProgressIfNeeded, unEnroll } from '../User/userSlice';
import { createSelector } from '@reduxjs/toolkit';

const sel = createSelector(
    [
        state => state.auth.isAuthenticated,
        state => state.auth.loading,
        state => state.user._id,
        state => state.user.name,
        state => state.user.loading
    ],
    (isAuthenticated, loading1, _id, name, loading2) => ({
        isAuthenticated,
        loading1,
        loading2,
        _id,
        name
    })
);

const Course = () => {
    // hooks
    const dispatch = useDispatch();
    const history = useHistory();
    const { courseId } = useParams();
    const [editing, edit] = useEdit();
    const [isSaving, setSave] = useState(false);
    const [imageUploader, setImageUploader] = useState(false);
    const [uploading, setUploading] = useState(false);
    const { isAuthenticated, loading1, loading2, _id: id, name } = useSelector(sel);
    const courseChanges = useRef({});
    const { data: course, error } = useSWR(!loading1 ? `get-course-${courseId}` : null, () => {
        return courseApi.get(courseId);
    });

    if (error && navigator.onLine) return <div> Opps... not found </div>;
    if (!course || loading1) return <Loading />;

    const isInstructor = isAuthenticated && course.instructor._id === id;
    const isStudent = isAuthenticated && course.students.includes(id);
    if (editing && !isInstructor) edit(false);
    if (isStudent && course.courseProgress) {
        dispatch(addCourseProgressIfNeeded(courseId, course.courseProgress));
    }

    if (!courseChanges.current.imageURL) courseChanges.current.imageURL = course.imageURL;

    const onEnroll = async () => {
        if (!id) {
            history.push('?authMode=register');
            dispatch(setAlert('Please Register or Login to Enroll', 'danger'));
            return;
        }
        dispatch(
            enroll(courseId, courseProgress => {
                mutate(`get-course-${courseId}`, {
                    ...course,
                    students: [...course.students, id],
                    courseProgress
                });
                mutate(`get-custom-course-min-${id}`, curData => {
                    if (curData) {
                        curData[courseId] = {
                            course: {
                                name: course.name,
                                instructor: course.instructor,
                                tags: course.tags,
                                avgRating: course.avgRating,
                                imageURL: course.imageURL,
                                totalCoreResources: course.topics.reduce(
                                    (tot, top) => tot + top.coreResources.length,
                                    0
                                )
                            },
                            courseProgress: course.courseProgress
                        };
                    }
                    return curData;
                });
            })
        );
    };

    const onUnEnroll = async () => {
        dispatch(
            unEnroll(courseId, () => {
                const index = course.students.findIndex(id_ => id_ === id);
                mutate(`get-course-${courseId}`, {
                    ...course,
                    students: [
                        ...course.students.slice(0, index),
                        ...course.students.slice(index + 1)
                    ]
                });
            })
        );
    };

    const saveCourse = async () => {
        try {
            const promises = [];
            const changes = { ...courseChanges.current };

            changes.name = stripHtml(changes.name);

            // For updating course name & description & tags

            if (changes.tags === course.tags) delete changes.tags;

            if (changes.imageURL === course.imageURL) delete changes.imageURL;

            if (changes.name === course.name) {
                delete changes.name;
            } else if (changes.name === '') {
                dispatch(setAlert("Name can't be empty", 'danger'));
                return;
            }

            if (changes.description === course.description) {
                delete changes.description;
            } else if (stripHtml(changes.description) === '') {
                dispatch(setAlert("Description can't be empty", 'danger'));
                return;
            }

            const emptyTopics = changes.topics.filter(topic => stripHtml(topic.name) === '');
            if (emptyTopics.length) {
                dispatch(setAlert("Topic name can't be empty", 'danger'));
                return;
            }

            const colors = ['9c32ff', 'e000e0', '1447f0', '1fbe27', '02b3b3', '7961ff'];

            const rndInd = () => Math.floor(Math.random() * 6);

            if (
                changes.name &&
                !changes.imageURL &&
                course.imageURL.slice(0, 28) === 'https://via.placeholder.com'
            ) {
                changes.imageURL = `https://via.placeholder.com/280x200.png/${
                    colors[rndInd()]
                }/ffffff?text=${changes.name.toUpperCase()[0]}`;
            }

            if (changes.name || changes.description || changes.tags || changes.imageURL)
                promises.push(courseApi.update(courseId, changes));

            changes.topics.forEach(topic => (topic.name = stripHtml(topic.name)));

            // For deleting/renaming topic
            course.topics.forEach(topic => {
                const newTopicIndex = changes.topics.findIndex(
                    newTopic => newTopic._id === topic._id
                );

                if (newTopicIndex === -1) {
                    promises.push(topicApi.delete(course._id, topic._id));
                } else if (changes.topics[newTopicIndex].name !== topic.name) {
                    promises.push(
                        topicApi.update(topic._id, {
                            name: changes.topics[newTopicIndex].name
                        })
                    );
                }
            });

            // For adding new topic
            changes.topics.forEach((topic, i) => {
                if (!topic._id)
                    promises.push(topicApi.add(course._id, { name: topic.name, position: i }));
            });

            setSave(true);
            await Promise.all(promises);
            await mutate();
            setSave(false);
            edit(false);
        } catch (err) {
            if (err.errors) {
                const errors = err.errors;
                errors.forEach(e => dispatch(setAlert(e.msg, 'danger')));
            }
            setSave(false);
            edit(false);
        }
    };

    const cancel = () => {
        edit(false);
        window.location.reload(false);
    };

    const uploadImage = async file => {
        try {
            setUploading(true);

            const imageBase64 = await readFile(file);
            const image = await courseApi.uploadImage(imageBase64);

            setUploading(false);

            return image.url;
        } catch (err) {
            if (err.errors) {
                const errors = err.errors;
                errors.forEach(e => dispatch(setAlert(e.msg, 'danger')));
            }
            setUploading(false);
        }
    };

    return (
        <Fragment>
            <Header
                instructor={isInstructor}
                student={isStudent}
                edit={edit}
                editing={editing}
                course={course}
                saveCourse={saveCourse}
                cancelSave={cancel}
                enroll={onEnroll}
                unEnroll={onUnEnroll}
                isSaving={isSaving}
                isEnrolling={loading2}
                courseChanges={courseChanges}
                uploading={uploading}
                user={name}
            />
            {imageUploader && (
                <ImageUploader
                    uploading={uploading}
                    upload={uploadImage}
                    courseChanges={courseChanges}
                    close={() => setImageUploader(false)}
                />
            )}
            <div className='container'>
                {editing && (
                    <Button
                        text='Change Image'
                        className='u-margin-bottom-small'
                        onClick={() => setImageUploader(true)}
                    />
                )}
                {editing && <Tags courseChanges={courseChanges} tags={course.tags} />}
                <Description
                    editing={editing}
                    desc={course.description}
                    courseChanges={courseChanges}
                />
                {!loading2 ? (
                    <Content
                        editing={editing}
                        course={course}
                        courseChanges={courseChanges}
                        isInstructor={isInstructor}
                    />
                ) : (
                    <Loading />
                )}

                {!editing && course.reviews.length > 0 && <Feedback course={course} />}
                {!editing && <Review isStudent={isStudent} isInstructor={isInstructor} />}
            </div>
        </Fragment>
    );
};

export default Course;
