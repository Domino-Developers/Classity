import React from 'react';
import Button from '../button';

import './style.css';

const Header = () => (
    <header>
        <div className='hero-box'>
            <h1>
                Best Courses for
                <br />
                your Better Future!
            </h1>
            <Button text='Register' full />
            <Button text='Explore' />
        </div>
    </header>
);

export default Header;
