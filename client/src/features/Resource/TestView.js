import React from 'react';
import Button from '../../components/Button';

const TestView = ({ payload }) => {
    return (
        <div className='test-container'>
            <h2 className='test-heading'> {payload.name} </h2>
            <div className='test-bottom'>
                <div className='submit-test'>
                    <div className='submit-test-left'>
                        <h3>Submit Assignment</h3>
                        <div className='small-text'>
                            <b>ATTEMPTS</b> 3 every 8 hours
                        </div>
                    </div>
                    <div className='submit-test-right'>
                        <Button text='Attempt' full></Button>
                    </div>
                </div>
                <div className='student-score'>
                    <div className='student-score-left'>
                        <h3>Recieve grade</h3>
                        <div className='small-text'>
                            <b>TO PASS: </b> Score more than or equal to {payload.passScore}%
                        </div>
                    </div>
                    <div className='student-score-right'>
                        <div className='grade'>
                            <h3>Grade</h3>
                            {payload.score}%
                        </div>
                        <Button text='View Feedback' full></Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestView;
