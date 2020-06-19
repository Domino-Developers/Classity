import React from 'react';
import Button from '../Button';

import './Header.css';

const Header = () => (
    <header>
        <div className='hero-box'>
            <h1 class='hero-text'>
                Best Courses for
                <br />
                your Better Future!
            </h1>
            <Button text='Join for Free' full />
            <Button text='Explore' />
        </div>
    </header>
);

export default Header;
