import React, { Fragment, useState } from 'react';
import useSWR from 'swr';

import Button from '../../components/Button';
import testApi from '../../api/test';
import Test from './Test';
import Loading from '../../components/Loading';

const TestView = ({ payload }) => {
    const [started, setStarted] = useState(false);

    const { data: test } = useSWR(`get-test-${payload.testId}`, () => testApi.get(payload.testId));

    const start = () => {
        setStarted(true);
    };

    if (!test) return <Loading />;

    return (
        <Fragment>
            {started && <Test test={test} />}
            <div className='test-view'>
                <h2 className='test-view__heading'> {payload.name} </h2>
                <div className='test-view__content'>
                    <div>
                        <h3 className='test-view__text--bold'>Submit Assignment</h3>
                        <div className='test-view__text--small'>
                            <span className='test-view__text--bold'>ATTEMPTS</span> 3 every 8 hours
                        </div>
                    </div>
                    <div>
                        <Button text='Attempt' full onClick={start}></Button>
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
                        <div className='u-center-text'>
                            <div className='test-view__grade--text'>
                                Grade
                                <br />
                                {payload.score}%
                            </div>
                        </div>
                        <Button text='View Feedback'></Button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default TestView;
