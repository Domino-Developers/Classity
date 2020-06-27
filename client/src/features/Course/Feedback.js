import React from 'react';

import Rating from '../../components/Rating';

const Feedback = () => (
    <section>
        <h2>Student Feedback</h2>
        <div className='feedback'>
            <div className='big-rating'>
                <p>2.0</p>
                <Rating rating='2' />
            </div>
            <div className='bar bar-5'>
                <div className='bar-filled' style={{ width: '53%' }}></div>
            </div>
            <div className='rating rating-5'>
                <Rating rating='5' />
                <p>53%</p>
            </div>
            <div className='bar bar-4'>
                <div className='bar-filled' style={{ width: '35%' }}></div>
            </div>
            <div className='rating rating-4'>
                <Rating rating='4' />
                <p>35%</p>
            </div>
            <div className='bar bar-3'>
                <div className='bar-filled' style={{ width: '9%' }}></div>
            </div>
            <div className='rating rating-3'>
                <Rating rating='3' />
                <p>9%</p>
            </div>
            <div className='bar bar-2'>
                <div className='bar-filled' style={{ width: '2%' }}></div>
            </div>
            <div className='rating rating-2'>
                <Rating rating='2' />
                <p>2%</p>
            </div>
            <div className='bar bar-1'>
                <div className='bar-filled' style={{ width: '1%' }}></div>
            </div>
            <div className='rating rating-1'>
                <Rating rating='1' />
                <p>1%</p>
            </div>
        </div>
    </section>
);

export default Feedback;
