import { useMemo } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';

export const useQuery = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    return [query, location];
};

export const useEdit = () => {
    const [query, location] = useQuery();
    const history = useHistory();

    const editing = query.get('edit') === 'true';
    const edit = e => {
        if (e) history.replace(`${location.pathname}?edit=true`);
        else history.replace(`${location.pathname}`);
    };

    return [editing, edit];
};
const makeCPrSelector = (courseId, topicId) => {
    if (!topicId) {
        return createSelector(
            state => state.user.coursesEnrolled[courseId].topicStatus,
            topicStatus => {
                const ids = [];
                Object.values(topicStatus).forEach(res => {
                    ids.push(...res);
                });
                return ids;
            }
        );
    }

    return createSelector(
        state => state.user.coursesEnrolled[courseId].topicStatus[topicId],
        // (_, courseId, topicId) => {
        //     console.log(courseId, topicId);
        //     return {
        //         courseId,
        //         topicId
        //     };
        // },
        courseProgress => courseProgress
    );
};

export const useResourceStatus = (isInstructor, courseId, topicId) => {
    const cPrSelector = useMemo(
        () => (isInstructor ? () => null : makeCPrSelector(courseId, topicId)),
        [isInstructor, courseId, topicId]
    );
    const resourcesDone = useSelector(cPrSelector) || [];
    return resourcesDone;
};
