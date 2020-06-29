import React from 'react';
import { setAlert } from '../../features/Alerts/alertSlice';

import Button from '../Button';
import { useDispatch } from 'react-redux';

const Header = () => {
    const dispatch = useDispatch();

    return (
        <section>
            <header>
                <div className='hero-box'>
                    <h1 className='hero-text'>
                        Better Platform
                        <br />
                        for Better Future!
                    </h1>
                    <Button
                        text='Join for Free'
                        full
                        onClick={() => {
                            dispatch(setAlert('test', 'success'));
                        }}
                    />
                </div>
            </header>
        </section>
    );
};

export default Header;
