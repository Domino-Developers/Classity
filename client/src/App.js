import React, { Fragment } from 'react';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';

import './App.css';

function App() {
    return (
        <Fragment>
            <Navbar />
            <div className='main'>
                <Landing />
            </div>
        </Fragment>
    );
}

export default App;
