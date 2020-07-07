import React from 'react';
import { useHistory } from 'react-router-dom';

import Button from '../Button';

const Header = () => {
    const history = useHistory();

    return (
        <section>
            <header>
                <div className='hero-box'>
                    <h1 className='hero-text'>
                        Bunk Your Classes,
                        <br />
                        Not your studies .
                    </h1>
                    <Button
                        text='Join for Free'
                        full
                        onClick={() => {
                            history.push('?authMode=register');
                        }}
                    />
                </div>
            </header>
        </section>
    );
};

export default Header;
