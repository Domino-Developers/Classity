import React, { Fragment, useState } from 'react';

import Button from '../../components/Button';
import Test from './Test';

const TestView = ({ payload }) => {
    const [started, setStarted] = useState(false);

    const start = () => {
        setStarted(true);
    };

    return (
        <Fragment>
            {started && <Test payload={payload} />}
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
                            or equal to {payload.passScore}%
                        </div>
                    </div>
                    <div className='test-view__grade'>
                        <div className='u-center-text'>
                            <div className='test-view__grade--text'>Grade</div>
                            {payload.score}%
                        </div>
                        <Button text='View Feedback'></Button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default TestView;
