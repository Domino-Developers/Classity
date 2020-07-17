import React from 'react';
import { useHistory } from 'react-router-dom';

import Button from '../Button';

const Header = () => {
    const history = useHistory();

    return (
        <section>
            <header className='landing-header'>
                <div className='landing-header__box'>
                    <h1 className='landing-header__text'>
                        Bunk Your Class
                        <br />
                        Not The Studies!
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
