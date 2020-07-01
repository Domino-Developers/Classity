import React from 'react';
import loadable from '@loadable/component';
import Goals from './Goals';
import Header from './Header';
import './Landing.css';

const CardsContainer = loadable(() => import('../../features/CardsContainer'));

const Landing = () => (
    <div>
        <Header />
        <Goals />
        <div className='container'>
            <CardsContainer fallback={<div> Loading ... </div>} />
        </div>
    </div>
);

export default Landing;
