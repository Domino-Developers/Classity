import React, { Fragment, useState } from 'react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';

import course from '../../api/course';

import Header from './Header';
import Description from './Description';
import Content from './Content';
import Feedback from './Feedback';
import Review from './Review';
import Loading from '../../components/Loading';

import './Course.css';
import { useSelector } from 'react-redux';

const Course = () => {
    const { courseId } = useParams();
    const {
        isAuthenticated,
        loading,
        userData: { id }
    } = useSelector(state => state.auth);

    const { data, error } = useSWR(`get-course-${courseId}`, () => {
        return course.get(courseId).then(res => res);
    });
    const [editing, edit] = useState(false);

    const isInstructor =
        !loading && isAuthenticated && data && data.instructor._id === id;

    if (error) return <div> Opps... not found </div>;
    if (!data) return <Loading />;

    console.log(data);

    return (
        <Fragment>
            <Header
                instructor={isInstructor}
                edit={edit}
                editing={editing}
                course={data}
            />
            <div className='container'>
                <Description editing={editing} desc={data.description} />
                <Content editing={editing} course={data} />
                {!editing &&
                    (data.reviews.length > 0 ? (
                        <Feedback course={data} />
                    ) : (
                        <p>No reviews yet</p>
                    ))}
                {!editing && data.reviews.length > 0 && (
                    <Review reviews={data.reviews} />
                )}
            </div>
        </Fragment>
    );
};

export default Course;
