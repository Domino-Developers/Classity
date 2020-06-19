import React, { Fragment } from 'react';
import Navbar from './components/layout/Navbar';
import Header from './components/layout/Header';

import './App.css';

function App() {
    return (
        <Fragment>
            <Navbar />
            <div className='main'>
                <Header />
            </div>
        </Fragment>
    );
}

export default App;
