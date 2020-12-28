import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import useSWR from 'swr';
import Breadcrumb from '../Breadcrumb';
import Loading from '../Loading';

//apis
import courseApi from '../../api/course';
import topicApi from '../../api/topic';
import { createSelector } from '@reduxjs/toolkit';
import ProgressCircle from './ProgressCircle';

const CoursesCreatedSelector = createSelector(
    state => state.user.coursesCreated,
    coursesCreated => coursesCreated
);

const TopBar = ({ params, setExist }) => {
    const smallScreenQueries = [];
    smallScreenQueries.push(window.matchMedia('(max-width: 68.75em)')); // Name Max Length = 20
    smallScreenQueries.push(window.matchMedia('(max-width: 50em)')); // No "Your Progress"
    smallScreenQueries.push(window.matchMedia('(max-width: 43.75em)')); // Max Breadcrumb size = 2
    smallScreenQueries.push(window.matchMedia('(max-width: 31.25em)')); // Name Max Length = 15
    smallScreenQueries.push(window.matchMedia('(max-width: 25em)')); // No BreadCrumb + "Your Progress"

    const [compression, setCompression] = useState({
        level0: smallScreenQueries[0].matches,
        level1: smallScreenQueries[1].matches,
        level2: smallScreenQueries[2].matches,
        level3: smallScreenQueries[3].matches,
        level4: smallScreenQueries[4].matches
    });

    const handleCompression = () => {
        const newCompression = {};
        smallScreenQueries.forEach((query, i) => (newCompression[`level${i}`] = query.matches));
        setCompression(newCompression);
    };

    useEffect(() => {
        smallScreenQueries.forEach(query => query.addListener(handleCompression));

        return () => smallScreenQueries.forEach(query => query.removeListener(handleCompression));
    });

    const trimName = name => {
        let maxLen = 30;
        if (compression.level0) maxLen = 20;
        if (compression.level3) maxLen = 15;
        if (name.length <= maxLen) return name;
        return name.slice(0, maxLen - 3) + '...';
    };

    const { courseId, topicId } = params;
    const match = useRouteMatch('/course/:courseId/topic/:topicId/resource/:resourceId');
    const coursesCreated = useSelector(CoursesCreatedSelector);
    const { data: course, error: courseError } = useSWR(`get-course-${courseId}`, () =>
        courseApi.get(courseId)
    );
    const { data: topic, error: topicError } = useSWR(`get-topic-${topicId}`, () =>
        topicApi.get(topicId)
    );
    const instructor = coursesCreated.includes(courseId);

    let resourceId = null;
    if (match) resourceId = match.params.resourceId;

    let exist = true;
    useEffect(() => {
        if (!exist) setExist(false);
    });

    if ((courseError || topicError) && navigator.onLine) exist = false;
    if (!course || !topic) return <Loading />;

    let navList = [
        {
            name: trimName(course.name),
            link: `/course/${courseId}`
        },
        {
            name: trimName(topic.name),
            link: `/course/${courseId}/topic/${topicId}`
        }
    ];

    if (resourceId) {
        const resource = topic.coreResources.find(res => res._id === resourceId);
        if (!resource) {
            exist = false;
            return <Loading />;
        }
        navList.push({
            name: trimName(resource.name)
        });
    }

    if (compression.level2) navList = navList.slice(-2);
    if (compression.level4) navList = [];

    return (
        <Fragment>
            <div className='topbar'>
                <div className='topbar__left'>
                    <Breadcrumb.Container>
                        {navList.map((item, i) => (
                            <Breadcrumb.Item key={i} to={item.link}>
                                {item.name}
                            </Breadcrumb.Item>
                        ))}
                    </Breadcrumb.Container>
                </div>
                {!instructor && (
                    <ProgressCircle
                        course={course}
                        noText={compression.level1 && !compression.level4}
                    />
                )}
            </div>
        </Fragment>
    );
};

export default TopBar;
