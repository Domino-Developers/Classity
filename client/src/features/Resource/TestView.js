import React, { Fragment, useState, useMemo } from 'react';
import { createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import useSWR from 'swr';
import PropTypes from 'prop-types';

import Button from '../../components/Button';
import testApi from '../../api/test';
import Test from './Test';
import Loading from '../../components/Loading';
import FromNow from '../../components/FromNow';

const makeSelector = (courseId, testId) =>
    createSelector(
        state => state.user.coursesEnrolled[courseId].testScores[testId],
        test => test
    );
const TestView = ({ payload, courseId, topicId, resId, resDoneSize, totResSize }) => {
    const [started, setStarted] = useState(false);
    const sel = useMemo(() => makeSelector(courseId, payload.testId), [payload.testId, courseId]);

    const { data: test } = useSWR(`get-test-${payload.testId}`, () => testApi.get(payload.testId));
    const testStatus = useSelector(sel);

    const start = () => {
        setStarted(true);
    };

    if (!test) return <Loading />;

    let canAttempt = true,
        la,
        na;
    if (testStatus) {
        la = new Date(testStatus.lastAttemptDate);
        na = la.setTime(la.getTime() + 8 * 60 * 60 * 1000);
        if (na > Date.now()) canAttempt = false;
    }

    return (
        <Fragment>
            {started && (
                <Test
                    test={{
                        ...test,
                        _id: payload.testId,
                        name: payload.name,
                        courseId,
                        topicId,
                        resId
                    }}
                    pastScore={testStatus && testStatus.score}
                    resDoneSize={resDoneSize}
                    totResSize={totResSize}
                />
            )}
            <div className='test-view'>
                <h2 className='test-view__heading'> {payload.name} </h2>
                <div className='test-view__content'>
                    <div>
                        <h3 className='test-view__text--bold'>Submit Assignment</h3>
                        <div className='test-view__text--small'>
                            <span className='test-view__text--bold'>ATTEMPTS</span> 1 every 8 hours
                        </div>
                    </div>
                    <div>
                        {canAttempt ? (
                            <Button text='Attempt' full onClick={start}></Button>
                        ) : (
                            <span className='test-view__text--grey'>
                                Next Attempt <FromNow date={na} />
                            </span>
                        )}
                    </div>
                </div>
                <div className='test-view__content'>
                    <div>
                        <h3 className='test-view__text--bold'>Recieve grade</h3>
                        <div className='test-view__text--small'>
                            <span className='test-view__text--bold'>TO PASS: </span> Score more than
                            or equal to {test.passScore}%
                        </div>
                    </div>
                    <div className='test-view__grade'>
                        {testStatus && (
                            <Fragment>
                                <div className='u-center-text'>
                                    <div className='test-view__grade--text'>
                                        Grade
                                        <br />
                                        {(100 * testStatus.score) / test.questions.length}%
                                    </div>
                                </div>
                            </Fragment>
                        )}
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

TestView.propTypes = {
    payload: PropTypes.object.isRequired,
    courseId: PropTypes.string.isRequired
};

export default TestView;
