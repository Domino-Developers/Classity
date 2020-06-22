import React from 'react';

import Button from '../Button';

const Header = () => (
    <section>
        <header>
            <div className='hero-box'>
                <h1 className='hero-text'>
                    Better Platform
                    <br />
                    for Better Future!
                </h1>
                <Button text='Join for Free' full />
            </div>
        </header>
    </section>
);

export default Header;
