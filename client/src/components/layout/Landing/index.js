import React from 'react';

import Header from './Header';
import Goals from './Goals';

import './Landing.css';
import CardsContainer from '../CardsContainer';

const Landing = () => (
    <div>
        <Header />
        <Goals />
        <div className='container'>
            <CardsContainer />
        </div>
    </div>
);

export default Landing;
