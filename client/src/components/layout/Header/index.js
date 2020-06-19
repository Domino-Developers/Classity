import React from 'react';
import Button from '../Button';

import './Header.css';

const Header = () => (
    <header>
        <div className='hero-box'>
            <h1 class='hero-text'>
                Better Platform
                <br />
                for Better Future!
            </h1>
            <Button text='Join for Free' full />
        </div>
    </header>
);

export default Header;
